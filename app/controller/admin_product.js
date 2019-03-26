'use strict';

const { Controller } = require('egg');

class AdminProductController extends Controller {

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

  async getProduct() {
    const { id } = this.ctx.params;
    const products = await this.ctx.service.product.listProducts({ ids: [id] });
    this.ctx.body = {
      code: 0,
      data: {
        product: products[0],
      },
    };
  }

  async updateProduct() {
    const { id } = this.ctx.params;
    const { product } = this.ctx.request.body;
    product.id = id;
    await this.ctx.service.product.updateProduct(product);
    this.ctx.body = {
      code: 0,
    };
  }

}

module.exports = AdminProductController;
