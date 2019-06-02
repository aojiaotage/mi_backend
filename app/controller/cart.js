
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
    const carts = await this.ctx.service.cart.listItems(query);
    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        carts,
      },
    };
  }

  async getCartById() {
    const { id } = this.ctx.params;
    const query = {
      ids: [id],
    };
    const [cart] = await this.ctx.service.cart.listCarts(query);
    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        cart,
      },
    };
  }

  async deleteItemById() {
    const { id } = this.ctx.params;
    const query = {
      ids: [id],
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
    const { cart } = this.ctx.request.body;
    cart.id = id;
    await this.ctx.service.cart.editItemById(cart);
    this.ctx.body = {
      code: 0,
      status: 200,
    };
  }

}

module.exports = CartController;

