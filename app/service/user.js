'use strict';

const { Service } = require('egg');

class User extends Service {
  async createUserWithUnPw(username, password) {
    const created = await this.ctx.model.User.createUserWithUnPw(username, password);
    return created;
  }

  async loginWithUnPw(username, password) {
    const found = await this.ctx.model.User.loginWithUnPw(username, password);
    return found;
  }

}

module.exports = User;
