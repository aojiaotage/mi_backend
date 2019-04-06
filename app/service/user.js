'use strict';

const { Service } = require('egg');

class User extends Service {
  async createUserWithUnPw(username, password) {
    const created = await this.ctx.model.User.createUserWithUnPw(username,
      password);
    return created;
  }

  async loginWithUnPw(username, password) {
    const found = await this.ctx.model.User.loginWithUnPw(username, password);
    return found;
  }

  async getUserInfo(userId, opts) {
    const { isUserHimself } = opts;
    const select = ['id'];
    if (isUserHimself) {
      select.push('phoneNumber', 'email', 'phoneNumber', 'username', 'icon');
    }
    const user = await this.ctx.model.User.getUser(userId, select);
    return user;
  }
}

module.exports = User;
