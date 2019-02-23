'use strict';

const { Controller } = require('egg');

class SiteController extends Controller {

  async createUser() {
    const { username, password } = this.ctx.request.body;

    const createdUser = await this.ctx.service.user.createUserWithUnPw(username,
      password);

    this.ctx.body = {
      code: 0,
      data: {
        user: createdUser,
      },
    };
  }

  async getUser() {
    this.ctx.body = {
      'code': 0,
      'result': 'ok',
      'description': 'success',
      'data': {
        'send_order': 1,
        'unpaid_order': 2,
        'user': {
          'email': '',
          'icon': '//www.baidu.com/s?wd=%E4%BB%8A%E6%97%A5%E6%96%B0%E9%B2%9C%E4%BA%8B&tn=SE_PclogoS_8whnvm25&sa=ire_dl_gh_logo&rsv_dl=igh_logo_pcs',
          'mobile': '131****4068',
          'userName': 'tony',
          'user_id': 1313124239,
        },
      },
    };
  }

  async loginWithUnPw() {
    const { username, password } = this.ctx.request.body;

    const foundUser = await this.ctx.service.user.loginWithUnPw(username,
      password);

    this.ctx.session.user = { id: foundUser.id };

    this.ctx.body = {
      code: 0,
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
}

module.exports = SiteController;
