'use strict';

const { Controller } = require('egg');

class AddressController extends Controller {

  async createNewAddress() {
    const address = this.ctx.request.body;
    address.user_id = this.ctx.session.user.id;
    address.is_default = !!address.is_default;
    const created = await this.ctx.service.address.createNewAddress(address);
    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        address: created,
        result: created.id,
      },
    };
  }

  async listAddresses() {
    const { query } = this.ctx.request;
    query.userIds = [this.ctx.session.user.id];
    const addresses = await this.ctx.service.address.listAddresses(query);

    this.ctx.body = {
      code: 0,
      status: 200,
      data: addresses,
      result: 'ok',
    };
  }

  async getAddressById() {
    const { id } = this.ctx.params;
    const query = {
      ids: [id],
      userIds: [this.ctx.session.user.id],
    };
    const [address] = await this.ctx.service.address.listAddresses(query);
    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        address,
      },
    };
  }

  async deleteAddressById() {
    const { id } = this.ctx.params;
    const query = {
      ids: [id],
      userIds: [this.ctx.session.user.id],
    };
    const result = await this.ctx.service.address.deleteAddresses(query);
    this.ctx.body = {
      code: 0,
      status: 200,
      data: {},
    };
  }

  async updateAddressById() {
    const { id } = this.ctx.params;
    const { address } = this.ctx.request.body;
    address.id = id;
    address.user_id = this.ctx.session.user.id;

    await this.ctx.service.address.updateAddress(address);
    this.ctx.body = {
      code: 0,
      status: 200,
      data:{
        result: true,
      },
      result: 'ok',
    };
  }

}

module.exports = AddressController;

