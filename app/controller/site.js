'use strict';

const { Controller } = require('egg');

class SiteController extends Controller {

  async createUser() {
    const { username, password } = this.ctx.request.body;

    const createdUser = await this.ctx.service.user.createUserWithUnPw(username,
      password);

    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        user: createdUser,
      },
    };
  }

  async loginWithUnPw() {
    const { username, pwd, code } = this.ctx.request.body;

    let foundUser;
    if (pwd) {
      foundUser = await this.ctx.service.user.loginWithUnPw(username,
        pwd);
    } else if (code) {
      await this.ctx.service.sms.validateVCode(username, code);
      foundUser = await this.ctx.service.user.getUserByPhoneNumber(username);
    }

    this.ctx.session.user = { id: foundUser.id };

    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        attempt: this.ctx.session.attempts,
        user: {
          id: foundUser.id,
        },
      },
    };
  }

  async index() {
    this.ctx.body = {
      code: 0,
      data: {
        hasLogin: !!this.ctx.session.user,
      },
    };
  }

  async logout() {
    if (this.ctx.session.user) this.ctx.session.user = undefined;
    this.ctx.body = {
      code: 0,
    };
  }

  async sendVerifyCode() {
    const { phoneNumber } = this.ctx.request.body;
    await this.ctx.service.sms.sendVCode(phoneNumber);
    this.ctx.body = {
      code: 0,
    };
  }

}

module.exports = SiteController;
