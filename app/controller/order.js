
'use strict';

const { Controller } = require('egg');

class OrderController extends Controller {

  async createNewOrder() {
    const { order } = this.ctx.request.body;
    const created = await this.ctx.service.order.createNewOrder(order);
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

