
'use strict';

const { Service } = require('egg');

class Address extends Service {
  async createNewAddress(address) {
    const created = await this.app.model.Address.createNewAddress(address);
    return created;
  }

  async updateAddress(address) {
    const updatedRows = await this.app.model.Address.updateAddress(address);
    return updatedRows;
  }

  async listAddresses(query) {
    const addresses = await this.app.model.Address.listAddresses(query);
    return addresses;
  }

  async deleteAddresses(query) {
    const result = await this.app.model.Address.deleteAddresses(query);
    return result;
  }

  async getAddressDetail(id) {
    const [address] = await this.listAddresses({ ids: [id] });

    return {
      address,
    };
  }

}

module.exports = Address;

