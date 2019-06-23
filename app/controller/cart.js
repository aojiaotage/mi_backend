
'use strict';

const { Controller } = require('egg');

class CartController extends Controller {

  async createNewItem() {
    const { item } = this.ctx.request.body;
    const { service_info } = item;
    // const validateServiceStatus = await this.ctx.service.service.addNewService();
    item.user_id = this.ctx.session.user.id;
    const created = await this.ctx.service.cart.createNewItem(item);
    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        item: created,
      },
    };
  }

  async createNewService() {
    // const { cart } = this.ctx.request.body;
    // const created = await this.ctx.service.cart.createNewItem(cart);
    // this.ctx.body = {
    //   code: 0,
    //   status: 200,
    //   data: {
    //     cart: created,
    //   },
    // };
  }

  async listItems() {
    const { query } = this.ctx.request;
    const items = await this.ctx.service.cart.listItems(query);
    items.forEach(i => {
      i.goodsId = i.goods_id;
      i.product_name = i.name;
      i.num = i.nums;
      // TODO add real price here
      i.price = 100;
    });
    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        items,
      },
    };
  }

  async deleteItemById() {
    const { id } = this.ctx.params;
    const query = {
      id,
    };
    const result = await this.ctx.service.cart.deleteItemById(query);
    this.ctx.body = {
      code: 0,
      status: 200,
      data: {},
    };
  }

  async updateCart() {
    const { id } = this.ctx.params;
    const { cart } = this.ctx.request.body;
    cart.id = id;
    await this.ctx.service.cart.editCart(cart);
    this.ctx.body = {
      code: 0,
      status: 200,
    };
  }

  async editItemById() {
    const { id } = this.ctx.params;
    const { item } = this.ctx.request.body;
    item.id = id;
    item.nums = item.num;
    await this.ctx.service.cart.editItemById(item);
    this.ctx.body = {
      code: 0,
      status: 200,
    };
  }

}

module.exports = CartController;

