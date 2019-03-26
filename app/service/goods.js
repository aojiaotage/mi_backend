
'use strict';

const { Service } = require('egg');

class Goods extends Service {
  async createNewGoods(goods) {
    const created = await this.app.model.Goods.createNewGoods(goods);
    return created;
  }

  async listGoods(query) {
    const goods = await this.app.model.Goods.listGoods(query);
    return goods;
  }
}

module.exports = Goods;

