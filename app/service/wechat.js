'use strict';

const { Service } = require('egg');

// https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
class Wechat extends Service {

  static get ['WX_API_PREF']() {
    return 'https://api.weixin.qq.com/cgi-bin/';
  }

  static get ['APIS']() {
    return {
      getAT(appId, secret) {
        return `${Wechat.WX_API_PREF}token?grant_type=client_credential&appid=${appId}&secret=${secret}`;
      },
    };
  }

  getWechatRedisKey(appId) {
    return `WECHAT_ACCESS_TOKEN_APPID:${appId}`;
  }

  async getATFromWC() {

    const appId = this.app.config.wechat.APP_ID;

    let token = await this.app.redis.get(this.getWechatRedisKey(appId));

    if (!token) {
      const result = await this.app.curl(
        Wechat.APIS.getAT(appId, this.app.config.wechat.SECRET), {
          method: 'GET',
          dataType: 'json',
        });
      if (result && result.data && result.data.access_token) {
        token = result.data.access_token;
        await this.app.redis.set(this.getWechatRedisKey(appId),
          token, 'PX', 60 * 60 * 1000);
      }
    }
    return token;
  }

}

module.exports = Wechat;
