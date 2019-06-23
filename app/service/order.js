
'use strict';

const { Service } = require('egg');

class Order extends Service {
  async createNewOrder(order) {
    const created = await this.app.model.Order.createNewOrder(order);
    return created;
  }
  
  async updateOrder(order) {
    const updatedRows = await this.app.model.Order.updateOrder(order);
    return updatedRows;
  }
  
  async listOrders(query) {
    const orders = await this.app.model.Order.listOrders(query);
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

