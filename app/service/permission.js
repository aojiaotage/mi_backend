
'use strict';

const { Service } = require('egg');

class Permission extends Service {
  async createNewPermission(permission) {
    const created = await this.app.model.Permission.createNewPermission(permission);
    return created;
  }
  
  async updatePermission(permission) {
    const updatedRows = await this.app.model.Permission.updatePermission(permission);
    return updatedRows;
  }
  
  async listPermissions(query) {
    const permissions = await this.app.model.Permission.listPermissions(query);
    return permissions;
  }

  async getPermissionDetail(id) {
    const [permission] = await this.listPermissions({ ids: [id] });
    const ps = [
      this.ctx.service.goods.listGoods({ permission_id: id }),
    ];

    // TODO need to check the stock here.
    // const inventoryInfo = await InventoryService.getGoodsInventoryInfo();

    const [goodsList] = await Promise.all(
      ps);

    return {
      permission,
      goodsList,
    };
  }

}

module.exports = Permission;

