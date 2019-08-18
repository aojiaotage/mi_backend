'use strict';

const { Service } = require('egg');

class Goods extends Service {
  async createNewGoods(goods) {
    const created = await this.app.model.Goods.createNewGoods(goods);
    return created;
  }

  async listGoods(query) {
    const goods = await this.app.model.Goods.listGoods(query);
    return goods;
  }

  async updateGoods(goods) {
    const updatedRows = await this.app.model.Goods.updateGoods(goods);
    return updatedRows;
  }

  async getGoodsDetail(id) {
    const [goods] = await this.listGoods({ ids: [id] });
    return {
      goods,
    };
  }

  async fillGoodsInfo(goods) {

    goods.action_button = { // 商品购买、预约
      button_title: '加入购物车',
      is_bigtap: false,
      occ_timeout: 5000,
      sale_mode: 'standard',
      use_occ: false,
    };

    // await this.ctx.service.insurance.getInsuranceListByGoodsId(goods.id);
    goods.insurance = {
      list: [
        {
          goods_id: '2181600004',
          image_url: '//i1.mifile.cn/a1/pms_1524032278.1757986.jpg',
          market_price: '179',
          name: '小米6X 意外保障服务',
          price: '179',
          short_name: '小米6X 意外保障服务',
          sku: '19411',
          type: 'mi_6x',
        },
      ],
    };

    // await this.ctx.service.instalment.getInstalmentListByGoodsId(goods.id);
    goods.instalment = {
      default_instal: 'mifinanceinstal_m',
      list: [
        {
          bank: 'mifinanceinstal_m',
          desc: '小米分期',
          detail: [
            {
              interest: '35.50',
              rate: '2.22',
              stage: 3,
              stage_cost: '544.83',
              stage_interest: '11.83',
              total_cost: '1634.50',
            },
          ],
          title: '小米分期',
        },
      ],
    };

    goods.prop_list = [
      {
        prop_cfg_id: 185,
        prop_value_id: 618,
      },
    ];

    // await this.ctx.service.servicebargain.getBargainListByGoodsId(goods.id);
    goods.service_bargins = [
      {
        can_multi: true,
        service_info: [
          {
            act_diff: '',
            act_id: '',
            act_price: '',
            goods_id: 2181500027,
            goods_name: '小米6X 4GB+64GB 曜石黑',
            item_id: '',
            new_insurance_cat: true,
            phone_accidentIns: [
              {
                desc: '服务条款',
                url: 'https://order.mi.com/static/jrUrl?url=https%3A%2F%2Fapi.jr.mi.com%2Finsurance%2Fdocument%2Fphone_accidentIns.html%3Ffrom%3Dins_phonedetail_bxtk%26insuranceSku%3D19411%26couponFrom%3Drule',
              },
            ],
            phone_accidentIns_sku: '19411',
            service_desc: '手机意外摔落/进水/碾压等损坏',
            service_goods_id: '2181600004',
            service_image_url: '//i1.mifile.cn/a1/pms_1524032278.1757986.jpg',
            service_name: '小米6X 意外保障服务',
            service_price: '179',
            service_short_name: '意外保障服务',
            service_url: 'https://cdn.cnbj0.fds.api.mi-img.com/b2c-data-mishop/4a15d767c1fe.html',
            source: 'common',
          },
        ],
        service_url: 'https://cdn.cnbj0.fds.api.mi-img.com/b2c-data-mishop/4a15d767c1fe.html',
        type_name: '保障服务',
      },
    ];

    goods.service_refound_policy = {
      desc: '支持7天无理由退货',
      is_support: true,
    };

    goods.service_refound_policy_list = {
      list: [
        {
          goods_id: 2181500027,
          img_url: 'http://i8.mifile.cn/b2c-mimall-media/a32fabc4c2cecf39e88b9b018fb8d6ec.png',
          is_support: true,
          item_content: '7日内，无人为损坏，包装配件齐全，可以无理由退货。',
          item_id: 1,
          item_name: '7天无理由退货',
          sku: 18638,
        },
      ],
      url: '',
    };

    goods.show_price_type = [];
    goods.stock_channel = '3';

    return goods;
  }

  async fillGoodsInfoForSale(goodsList) {

    const ps = [];

    for (let i = 0; i < goodsList.length; i += 1) {
      ps.push(this.fillGoodsInfo(goodsList[i]));
    }

    await Promise.all(ps);
  }
}

module.exports = Goods;

