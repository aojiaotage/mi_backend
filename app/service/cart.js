
'use strict';

const { Service } = require('egg');

class Cart extends Service {
  async createNewItem(item) {
    const [goods] = await this.app.model.Goods.listGoods({ ids: [item.goods_id ]});
    item.img_url = goods.img_url;
    item.price = goods.price;
    item.name = goods.name;
    console.log(goods.toJSON());
    const created = await this.app.model.Cart.createNewItem(item);
    // await this.app.model.userService.addUserService(item);
    return created;
  }

  async createNewServie(cart) {
    const created = await this.app.model.Cart.createNewServie(cart);
    return created;
  }

  async updateCart(cart) {
    const updatedRows = await this.app.model.Cart.updateCart(cart);
    return updatedRows;
  }

  async editItemById(cart) {
    const updatedRows = await this.app.model.Cart.editItemById(cart);
    return updatedRows;
  }

  async deleteItemById(cart) {
    const updatedRows = await this.app.model.Cart.deleteItemById(cart);
    return updatedRows;
  }

  async listItems(query) {
    // const carts = await this.app.model.Cart.listCarts(query);
    // return carts;
  }


}

module.exports = Cart;

