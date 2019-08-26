
'use strict';

const { Service } = require('egg');

class Cart extends Service {
  async createNewItem(item) {
    const [goods] = await this.app.model.Goods.listGoods({ ids: [item.goods_id ]});
    item.img_url = goods.img_url;
    item.price = goods.price;
    item.name = goods.name;
    item.product_id = goods.product_id;
    const created = await this.app.model.Cart.createNewItem(item);
    // await this.app.model.userService.addUserService(item);
    return created;
  }

  async createNewService(cart) {
    const created = await this.app.model.Cart.createNewService(cart);
    return created;
  }

  async updateCart(cart) {
    const updatedRows = await this.app.model.Cart.updateCart(cart);
    return updatedRows;
  }

  async editItemById(item) {
    const updatedRows = await this.app.model.Cart.updateItemById(item);
    return updatedRows;
  }

  async deleteItemById(cart) {
    const updatedRows = await this.app.model.Cart.deleteItemById(cart);
    return updatedRows;
  }

  async listItems(query) {
    const items = await this.app.model.Cart.listItems(query);
    // const services = await this.app.model.Service.listService(items);
    // items.services = services;

    return items.map(i => {
      const obj = i.toJSON();
      // TODO fake data here
      obj.serviceInfo = [];
      return obj;
    });
  }


}

module.exports = Cart;

