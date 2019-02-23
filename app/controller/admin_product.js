'use strict';

const { Controller } = require('egg');

class SiteController extends Controller {

  async createNewProduct() {
    const { product } = this.ctx.request.body;
    const created = await this.ctx.service.product.createNewProduct(product);
    this.ctx.body = {
      code: 0,
      data: {
        product: created,
      },
    };
  }

  async listProducts() {
    const { query } = this.ctx.request;
    const products = await this.ctx.service.product.listProducts(query);
    this.ctx.body = {
      code: 0,
      data: {
        products,
      },
    };
  }

}

module.exports = SiteController;
