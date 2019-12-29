'use strict';

const { Service } = require('egg');

class Order extends Service {

  static get ['DEFAULT_INVENTORY_LOCK_DELAY']() {
    return 15 * 60 * 1000;
  }

  async createNewOrder({ goods, user_id, address, best_time }) {
    const transaction = await this.app.model.transaction();

    const createdOrder = (await this.app.model.Order.createNewOrder({
      user_id,
      goods,
      transaction,
      address,
      best_time,
    })).toJSON();

    const subOrders = await this.app.model.SubOrder.createSubOrders({
      order_id: createdOrder.id,
      goods,
      transaction,
    });

    let totalGoodsNums = 0;
    let totalReducePrice = 0;
    let totalOriPrice = 0;

    const inventoryLockPs = [];
    const inventoryUnlockPs = [];

    for (let i = 0; i < subOrders.length; i += 1) {
      const subOrder = subOrders[i];
      totalGoodsNums += subOrder.nums;
      totalReducePrice += subOrder.reduce_price;
      totalOriPrice += subOrder.sub_total - subOrder.reduce_price;
      inventoryLockPs.push(
        this.ctx.service.inventory.addLocksByGoodsId(
          subOrder.goods_id,
          subOrder.id,
          subOrder.nums,
        ));
      inventoryUnlockPs.push(
        this.ctx.service.msgProducer.sendInventoryUnlockMsg(
          { goodsId: subOrder.goods_id, subOrderId: subOrder.id }, {
            headers: {
              'x-delay': Order.DEFAULT_INVENTORY_LOCK_DELAY,
            },
          }),
      );
    }

    createdOrder.goods_amount = totalGoodsNums;
    createdOrder.reduce_price = totalReducePrice;
    createdOrder.original_price = totalOriPrice;

    await this.app.model.Order.updateOrder(
      createdOrder,
      { transaction },
    );

    await transaction.commit();

    await Promise.all(inventoryLockPs);
    await Promise.all(inventoryUnlockPs);

    return createdOrder;
  }

  async createWXOrder() {

  }

  async updateOrderStatusFromWX() {

  }

  async createAliPayOrder() {

  }

  async createUnionPayOrder() {

  }

  async updateOrder(order) {
    const updatedRows = await this.app.model.Order.updateOrder(order);
    return updatedRows;
  }

  async listOrders(query) {
    let orders = await this.app.model.Order.listOrders(query);
    const order_ids = orders.map(o => o.id);
    const subOrders = await this.app.model.SubOrder.listOrders({ order_ids });
    orders = orders.map(o => {
      const obj = o.toJSON();
      obj.subOrders = subOrders.filter(
        s => s.order_id.toString() === o.id.toString());
      return obj;
    });
    return orders;
  }

  async getOrderDetail(id) {
    const [order] = await this.listOrders({ ids: [id] });
    const ps = [
      this.ctx.service.goods.listGoods({ order_id: id }),
    ];

    // TODO need to check the stock here.
    // const inventoryInfo = await InventoryService.getGoodsInventoryInfo();

    const [goodsList] = await Promise.all(
      ps);

    return {
      order,
      goodsList,
    };
  }

}

module.exports = Order;

