'use strict';

const BaseHttp = require('./base_http');

class InvalidParam extends BaseHttp {
  constructor(paramName, requirement, httpMsg) {
    const msg = `${paramName} does not meet requirement: ${requirement}`;
    super(msg, 40003, httpMsg || '输入有问题呀老铁', 403);
  }

  static get ['CODE']() {
    return 40003;
  }
}

module.exports = InvalidParam;
