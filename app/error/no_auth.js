'use strict';

const BaseHttp = require('./base_http');

class NoAuth extends BaseHttp {
  constructor(httpMsg) {
    const msg = 'No auth, please login or confirm that you have the auth to this operation';
    super(msg, NoAuth.CODE, httpMsg || '没有权限执行该操作', 401);
  }

  static get ['CODE']() {
    return 40101;
  }
}

module.exports = NoAuth;
