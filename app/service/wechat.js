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
      getUserList(accessToken, nextOpenId) {
        return `${Wechat.WX_API_PREF}user/get?access_token=${accessToken}${nextOpenId
          ? `&next_openid=${nextOpenId}`
          : ''}`;
      },
      getUserInfo(accessToken, openId) {
        return `${Wechat.WX_API_PREF}user/info?access_token=${accessToken}&openid=${openId}&lang=zh_CN`;
      },
      sendCSMsg(accessToken) {
        return `${Wechat.WX_API_PREF}message/custom/send?access_token=${accessToken}`;
      },
      sendTemplateMsg(accessToken) {
        return `${Wechat.WX_API_PREF}message/template/send?access_token=${accessToken}`;
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

  async getUserListFromWC(nextOpenId) {
    const token = await this.getATFromWC();
    const result = await this.app.curl(
      Wechat.APIS.getUserList(token, nextOpenId), {
        method: 'GET',
        dataType: 'json',
        timeout: 60000,
      });
    return result.data;
  }

  async getUserInfoFromWC(openId) {
    const token = await this.getATFromWC();
    const result = await this.app.curl(
      Wechat.APIS.getUserInfo(token, openId), {
        method: 'GET',
        dataType: 'json',
        timeout: 60000,
      });
    return result.data;
  }

  async sendCSMsgToUser(openId, wcCSData) {
    const token = await this.getATFromWC();
    const result = await this.app.curl(
      Wechat.APIS.sendCSMsg(token), {
        method: 'POST',
        dataType: 'json',
        timeout: 600000,
        data: JSON.stringify(wcCSData),
      });
    return result;
  }

  async sendTemplateMsgToUser({ openId, templateId, data, url }) {
    const token = await this.getATFromWC();
    const result = await this.app.curl(
      Wechat.APIS.sendTemplateMsg(token), {
        method: 'POST',
        dataType: 'json',
        timeout: 600000,
        data: JSON.stringify({
          touser: openId,
          template_id: templateId,
          url,
          data,
        }),
      });
    return result;
  }

}

module.exports = Wechat;
