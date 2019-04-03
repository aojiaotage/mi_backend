'use strict';

const { Service } = require('egg');

class Product extends Service {
  async createNewProduct(product) {
    const created = await this.app.model.Product.createNewProduct(product);
    return created;
  }

  async listProducts(query) {
    const products = await this.app.model.Product.listProducts(query);
    return products;
  }

  async updateProduct(product) {
    const updatedRows = await this.app.model.Product.updateProduct(product);
    return updatedRows;
  }

  async getProductDetail(id) {
    const [product] = await this.listProducts({ ids: [id] });
    const ps = [
      this.ctx.service.goods.listGoods({ product_id: id }),
    ];

    const [goodsList] = await Promise.all(
      ps);

    await this.ctx.service.inventory.fillGoodsRealInventory(goodsList);

    return {
      product,
      goodsList,
    };
  }
}

module.exports = Product;
