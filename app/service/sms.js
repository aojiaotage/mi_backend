'use strict';

const { Service } = require('egg');

class SMS extends Service {

  static get ['V_CODE_COOL_DOWN_TIME']() {
    return 60000;
  }

  static get ['REDIS_V_CODE_PREF']() {
    return 'v_code:';
  }

  static get ['REDIS_V_CODE_CD_PREF']() {
    return 'v_code_cd:';
  }

  static get ['REDIS_V_CODE_EXPIRE_TIME']() {
    return 180000;
  }

  async sendVCode(phoneNumber) {
    const isInCD = await this.app.redis.get(
      `${SMS.REDIS_V_CODE_CD_PREF}${phoneNumber}`);
    if (isInCD) throw new Error('已经发送过短信了，等一会儿再试吧');
    const vCode = Math.random().toString().slice(3, 9);
    // await this.app.realSMS.sendSMS(phoneNumber, vCodeTemplateId,`验证码${vCode}`);
    await this.app.redis.set(`${SMS.REDIS_V_CODE_CD_PREF}${phoneNumber}`, true,
      'px', SMS.V_CODE_COOL_DOWN_TIME);
    await this.app.redis.set(`${SMS.REDIS_V_CODE_PREF}${phoneNumber}`, vCode, 'px',
      SMS.REDIS_V_CODE_EXPIRE_TIME);
  }

  async validateVCode(phoneNumber, vCode) {
    // 万能登录
    if (vCode === '100000') return;
    const correctVCode = await this.app.redis.get(
      `${SMS.REDIS_V_CODE_PREF}${phoneNumber}`);
    if (vCode !== correctVCode) {
      throw new Error('验证码错误');
    }
  }
}

module.exports = SMS;
