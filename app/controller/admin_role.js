
'use strict';

const { Controller } = require('egg');

class RoleController extends Controller {

  async createNewRole() {
    const { role } = this.ctx.request.body;
    const created = await this.ctx.service.role.createNewRole(role);
    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        role: created,
      },
    };
  }

  async listRoles() {
    const { query } = this.ctx.request;
    const roles = await this.ctx.service.role.listRoles(query);
    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        roles,
      },
    };
  }

  async getRoleById() {
    const { id } = this.ctx.params;
    const query = {
      ids: [id],
    };
    const [role] = await this.ctx.service.role.listRoles(query);
    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        role,
      },
    };
  }

  async deleteRoleById() {
    const { id } = this.ctx.params;
    const query = {
      ids: [id],
    };
    const result = await this.ctx.service.role.deleteRoles(query);
    this.ctx.body = {
      code: 0,
      status: 200,
      data: {},
    };
  }

  async updateRoleById() {
    const { id } = this.ctx.params;
    const { role } = this.ctx.request.body;
    role.id = id;
    await this.ctx.service.role.updateRole(role);
    this.ctx.body = {
      code: 0,
      status: 200,
    };
  }

}

module.exports = RoleController;

