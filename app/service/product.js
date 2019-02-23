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
}

module.exports = Product;
