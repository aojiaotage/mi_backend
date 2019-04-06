'use strict';

const { Controller } = require('egg');

class UserController extends Controller {

  async getUser() {

    const { id } = this.ctx.session.user;

    const user = await this.ctx.service.user.getUserInfo(id,
      { isUserHimself: true });

    // TODO get user's order counts.
    // const unpaidOrderCount = await this.ctx.service.order.getUnpaidOrderCount();
    // const sendOrderCount = await this.ctx.service.order.getSendOrderCount();

    this.ctx.body = {
      code: 0,
      data: {
        user,
      },
    };
  }

  async logout() {
    if (this.ctx.session.user) this.ctx.session.user = undefined;
    this.ctx.body = {
      code: 0,
    };
  }
}

module.exports = UserController;
