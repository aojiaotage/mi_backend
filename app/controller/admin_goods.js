
'use strict';

const { Controller } = require('egg');

class GoodsControllerController extends Controller {

  async createNewGoods() {
    const { goods } = this.ctx.request.body;
    const created = await this.ctx.service.goods.createNewGoods(goods);
    this.ctx.body = {
      code: 0,
      data: {
        goods: created,
      },
    };
  }

  async listGoods() {
    const { query } = this.ctx.request;
    const goods = await this.ctx.service.goods.listGoods(query);
    this.ctx.body = {
      code: 0,
      data: {
        goods,
      },
    };
  }

}

module.exports = GoodsControllerController;

