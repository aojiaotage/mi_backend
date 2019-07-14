
'use strict';

const { Controller } = require('egg');

class OrderController extends Controller {

  async createNewOrder() {
    const { products, addressId, bestShipTime } = this.ctx.request.body;

    let goods = await this.ctx.service.goods.listGoods({ids: products.map(p => p.id)});

    goods = goods.map(g => {
      const p = products.find(e => e.id.toString() === g.id.toString());
      const gObj = g.toJSON();
      // gObj.coupons = p.coupons;
      gObj.nums = p.nums;
      gObj.reduce_price = 0;
      gObj.sub_total = (g.nums * (g.price || 0) - gObj.reduce_price) || 999999;
      return gObj;
    });

    const { address } = await this.ctx.service.address.getAddressDetail(addressId);
    // TODO 发票信息
    // const { invoice } = await this.ctx.service.invoice.getInvoiceDetail(invoiceId);

    // TODO 配送价格
    // const expense = await this.ctx.service.shipping.getShippingExpense(invoiceId);


    // TODO 检查库存
    // this.ctx.service.inventory.checkInventory(goods);


    const created = await this.ctx.service.order.createNewOrder({
      user_id: this.ctx.session.user.id,
      goods,
      address,
      best_time: bestShipTime,
    });

    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        order: created,
      },
    };
  }

  async listOrders() {
    const { query } = this.ctx.request;
    const orders = await this.ctx.service.order.listOrders(query);
    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        orders,
      },
    };
  }

  async getOrderById() {
    const { id } = this.ctx.params;
    const query = {
      ids: [id],
    };
    const [order] = await this.ctx.service.order.listOrders(query);
    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        order,
      },
    };
  }

  async updateOrderById() {
    const { id } = this.ctx.params;
    const { order } = this.ctx.request.body;
    order.id = id;
    await this.ctx.service.order.updateOrder(order);
    this.ctx.body = {
      code: 0,
      status: 200,
    };
  }

}

module.exports = OrderController;

