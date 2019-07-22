
'use strict';

const { Service } = require('egg');

class Role extends Service {
  async createNewRole(role) {
    const created = await this.app.model.Role.createNewRole(role);
    return created;
  }
  
  async updateRole(role) {
    const updatedRows = await this.app.model.Role.updateRole(role);
    return updatedRows;
  }
  
  async listRoles(query) {
    const roles = await this.app.model.Role.listRoles(query);
    return roles;
  }

  async getRoleDetail(id) {
    const [role] = await this.listRoles({ ids: [id] });
    const ps = [
      this.ctx.service.goods.listGoods({ role_id: id }),
    ];

    // TODO need to check the stock here.
    // const inventoryInfo = await InventoryService.getGoodsInventoryInfo();

    const [goodsList] = await Promise.all(
      ps);

    return {
      role,
      goodsList,
    };
  }

}

module.exports = Role;

