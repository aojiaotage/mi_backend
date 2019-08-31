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

  async navList() {
    this.ctx.body = {
      code: 0,
      data: {
        list: ['推荐', '智能', '电视', '电脑', '手机', '双摄', '全面屏', '生活周边', '盒子']
          .map((e, i) => {
            return {
              page_id: e,
              name: e,
            };
          }),
      },
    };
  }

  async forRecommend() {

    const products = await this.ctx.service.product.listProducts({ limit: 10 });

    const recList = products.map(p => {
      return {
        'action': {
          'type': 'product',
          'path': p.id,
          'log_code': 'recom_list_0-1#eid=force_15:0:0:0:0:0:0:0:0:7354&tid=BlankRec-78cpaAwFqwUTL0eVFuqCzg==&page=list&pid=7354',
          'recommend_code': 'recom_list_0-1#eid=force_15:0:0:0:0:0:0:0:0:7354&tid=BlankRec-78cpaAwFqwUTL0eVFuqCzg==&page=list&pid=7354',
        },
        'image_url': '//i8.mifile.cn/v1/a1/48af122b-362c-dae5-8305-899805faf635.webp',
        'is_multi_price': false,
        'market_price': '799',
        'name': p.name,
        'price': '699',
        'product_desc': `<font color=\'#ff4a00\'>${p.product_desc}`,
        'product_tag': '',
      };
    });

    this.ctx.body = {
      code: 0,
      data: {
        'header': {
          'view_type': 'cells_auto_fill',
          'body': {
            'w': 720,
            'h': 120,
            'height': '0',
            'width': '0',
            'items': [
              {
                'w': 720,
                'h': 120,
                'img_url': '//cdn.cnbj0.fds.api.mi-img.com/b2c-mimall-media/e95ade2750a7fde92369b416c7d3176d.jpg',
                'path_type': 'image',
              },
            ],
            'win_prize_action': null,
            'not_win_prize_action': null,
          },
        },
        'recom_list': recList,
        'title': '为你推荐',
      },
    };
  }

  async recommend() {

    const products = await this.ctx.service.product.listProducts({ limit: 10 });

    const recList = products.map(p => {
      return {
        action: {
          type: 'product',
          path: p.id,
          log_code: 'recom_list_0-1#eid=force_15:0:0:0:0:0:0:0:0:7354&tid=BlankRec-78cpaAwFqwUTL0eVFuqCzg==&page=list&pid=7354',
          recommend_code: 'recom_list_0-1#eid=force_15:0:0:0:0:0:0:0:0:7354&tid=BlankRec-78cpaAwFqwUTL0eVFuqCzg==&page=list&pid=7354',
        },
        image_url: '//i8.mifile.cn/v1/a1/48af122b-362c-dae5-8305-899805faf635.webp',
        big_image_url: '//i8.mifile.cn/v1/a1/48af122b-362c-dae5-8305-899805faf635.webp',
        is_multi_price: false,
        market_price: '799',
        name: p.name,
        price: '699',
        product_desc: `<font color=\'#ff4a00\'>${p.product_desc}`,
        product_tag: '',
      };
    });

    this.ctx.body = {
      code: 0,
      data: {
        recommend_list: recList,
        title: '为你推荐',
      },
    };
  }

  async estDelivery() {

    let address = {
      address: '北京市 西城区',
      id: '',
    };

    const userId = this.ctx.session.user && this.ctx.session.user.id;

    if (userId) {
      address = (await this.ctx.service.address.listAddresses(
        { userIds: [userId] }))[0];
    }

    this.ctx.body = {
      code: 0,
      data: {
        address: {
          address: address.address,
        },
        address_info: {
          address: address.address,
          address_id: address.id,
        },
        datas: [
          {
            stock_status: '有现货',
          },
        ],
        title: '为你推荐',
      },
    };
  }

  async category() {
    this.ctx.body = {
      code: 0,
      data: {
        'lists': [
          {
            'category_name': '新品',
            'category_list': [
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/ed79f2',
                    'product_name': '小米8',
                    'category_id': '500000197712079563',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2c9',
                    'product_name': '小米8 SE',
                    'category_id': '65000019780504360X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2a679',
                    'product_name': '小米MIX 2S',
                    'category_id': '120000199701067274',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/8379f2',
                    'product_name': '小米8',
                    'category_id': '630000197601247359',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/92f279',
                    'product_name': '小米8 SE',
                    'category_id': '360000198412241424',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279b5',
                    'product_name': '小米MIX 2S',
                    'category_id': '140000198510089955',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79d9f2',
                    'product_name': '小米8',
                    'category_id': '51000019950822164X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2e879',
                    'product_name': '小米8 SE',
                    'category_id': '210000197504156588',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/c479f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '510000197812172804',
                  }],
              },
              {
                'category_title': '红米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2a1',
                    'product_name': '小米8',
                    'category_id': '500000200607066757',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f27e79',
                    'product_name': '小米8 SE',
                    'category_id': '640000200907253010',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/7997f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '540000198502268712',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/baf279',
                    'product_name': '小米8',
                    'category_id': '420000200001247238',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/f279de',
            'category_id': '230000198809212171',
          },
          {
            'category_name': '手机',
            'category_list': [
              {
                'category_title': '手机配件',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2e2',
                    'product_name': '小米8 SE',
                    'category_id': '640000200604246980',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2bf79',
                    'product_name': '小米MIX 2S',
                    'category_id': '650000199007264570',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/9c79f2',
                    'product_name': '小米8',
                    'category_id': '350000199801230473',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f279',
                    'product_name': '小米8 SE',
                    'category_id': '340000199507185876',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2799c',
                    'product_name': '小米MIX 2S',
                    'category_id': '410000199910213193',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79c0f2',
                    'product_name': '小米8',
                    'category_id': '710000199909163652',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/e3f279',
                    'product_name': '小米8 SE',
                    'category_id': '120000197907292160',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/dd79f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '350000200812034895',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2ba',
                    'product_name': '小米8',
                    'category_id': '31000020031127966X',
                  }],
              },
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/f29779',
                    'product_name': '小米8 SE',
                    'category_id': '13000019821007520X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/797ef2',
                    'product_name': '小米MIX 2S',
                    'category_id': '610000199711190889',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/a1f279',
                    'product_name': '小米8',
                    'category_id': '420000200210248464',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279c5',
                    'product_name': '小米8 SE',
                    'category_id': '610000198209055652',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79e8f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '990000199408104138',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2d879',
                    'product_name': '小米8',
                    'category_id': '330000197903248719',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/b579f2',
            'category_id': '430000200701289713',
          },
          {
            'category_name': '电脑',
            'category_list': [
              {
                'category_title': '红米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f291',
                    'product_name': '小米8 SE',
                    'category_id': '530000197106238793',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f27983',
                    'product_name': '小米MIX 2S',
                    'category_id': '350000200308208833',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79a6f2',
                    'product_name': '小米8',
                    'category_id': '990000200205293624',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/caf279',
                    'product_name': '小米8 SE',
                    'category_id': '54000020110522979X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279ed',
                    'product_name': '小米MIX 2S',
                    'category_id': '120000198002074470',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2d3',
                    'product_name': '小米8',
                    'category_id': '150000197508192782',
                  }],
              },
              {
                'category_title': '手机配件',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2b079',
                    'product_name': '小米8 SE',
                    'category_id': '220000200411183276',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/8c79f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '430000197504114290',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/88f279',
                    'product_name': '小米8',
                    'category_id': '140000199903280181',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279ac',
                    'product_name': '小米8 SE',
                    'category_id': '630000199403138230',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79cff2',
                    'product_name': '小米MIX 2S',
                    'category_id': '360000201201241074',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/f2f179',
            'category_id': '460000200706229360',
          },
          {
            'category_name': '新品',
            'category_list': [
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/ce79f2',
                    'product_name': '小米8',
                    'category_id': '460000199102251764',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2aa',
                    'product_name': '小米8 SE',
                    'category_id': '120000199102091555',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f28779',
                    'product_name': '小米MIX 2S',
                    'category_id': '62000020030917532X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/798df2',
                    'product_name': '小米8',
                    'category_id': '510000197209194742',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/b1f279',
                    'product_name': '小米8 SE',
                    'category_id': '420000199112264561',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279d4',
                    'product_name': '小米MIX 2S',
                    'category_id': '430000199505234699',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2ec',
                    'product_name': '小米8',
                    'category_id': '990000198008207221',
                  }],
              },
              {
                'category_title': '红米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2c979',
                    'product_name': '小米8 SE',
                    'category_id': '440000198203112423',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/a579f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '500000199604276147',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f282',
                    'product_name': '小米8',
                    'category_id': '540000197711041448',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f27993',
                    'product_name': '小米8 SE',
                    'category_id': '540000198008187837',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79b6f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '540000200401226716',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/d9f279',
                    'product_name': '小米8',
                    'category_id': '510000198211178463',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/e779f2',
                    'product_name': '小米8 SE',
                    'category_id': '310000198104275228',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2c4',
                    'product_name': '小米MIX 2S',
                    'category_id': '420000197301043339',
                  }],
              },
              {
                'category_title': '手机配件',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2a079',
                    'product_name': '小米8',
                    'category_id': '140000201504056449',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/7d79f2',
                    'product_name': '小米8 SE',
                    'category_id': '140000199712275064',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/98f279',
                    'product_name': '小米MIX 2S',
                    'category_id': '510000197410135816',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279bb',
                    'product_name': '小米8',
                    'category_id': '820000200105284505',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79def2',
                    'product_name': '小米8 SE',
                    'category_id': '430000201404162489',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2e279',
                    'product_name': '小米MIX 2S',
                    'category_id': '61000019990220864X',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/be79f2',
            'category_id': '610000201311198398',
          },
          {
            'category_name': '手机',
            'category_list': [
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f29b',
                    'product_name': '小米8',
                    'category_id': '360000198509027627',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2797a',
                    'product_name': '小米8 SE',
                    'category_id': '370000199307252371',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/799df2',
                    'product_name': '小米MIX 2S',
                    'category_id': '460000201610155736',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/c0f279',
                    'product_name': '小米8',
                    'category_id': '340000198705176757',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279e4',
                    'product_name': '小米8 SE',
                    'category_id': '370000197504271281',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2dd',
                    'product_name': '小米MIX 2S',
                    'category_id': '530000199502060471',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2b979',
                    'product_name': '小米8',
                    'category_id': '82000020121014148X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/9679f2',
                    'product_name': '小米8 SE',
                    'category_id': '220000198305137647',
                  }],
              },
              {
                'category_title': '红米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/7ff279',
                    'product_name': '小米MIX 2S',
                    'category_id': '610000199610040160',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279a2',
                    'product_name': '小米8',
                    'category_id': '420000198908073635',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79c5f2',
                    'product_name': '小米8 SE',
                    'category_id': '640000200211209281',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/e9f279',
            'category_id': '310000200104066848',
          },
          {
            'category_name': '电脑',
            'category_list': [
              {
                'category_title': '手机配件',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/d779f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '330000198108283026',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2b4',
                    'product_name': '小米8',
                    'category_id': '360000197012182117',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f29179',
                    'product_name': '小米8 SE',
                    'category_id': '710000198512132079',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/7984f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '350000198104128110',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/a7f279',
                    'product_name': '小米8',
                    'category_id': '150000197812190255',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279cb',
                    'product_name': '小米8 SE',
                    'category_id': '520000198611172978',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79eef2',
                    'product_name': '小米MIX 2S',
                    'category_id': '310000198402295331',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2d279',
                    'product_name': '小米8',
                    'category_id': '710000200512063675',
                  }],
              },
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/af79f2',
                    'product_name': '小米8 SE',
                    'category_id': '230000200609307651',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f28c',
                    'product_name': '小米MIX 2S',
                    'category_id': '320000199910116842',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f27989',
                    'product_name': '小米8',
                    'category_id': '320000199908319616',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79acf2',
                    'product_name': '小米8 SE',
                    'category_id': '320000199107101625',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/d0f279',
                    'product_name': '小米MIX 2S',
                    'category_id': '81000019920228119X',
                  }],
              },
              {
                'category_title': '红米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/f079f2',
                    'product_name': '小米8',
                    'category_id': '13000019891202006X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2cd',
                    'product_name': '小米8 SE',
                    'category_id': '540000199107019366',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2aa79',
                    'product_name': '小米MIX 2S',
                    'category_id': '220000198805244449',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/8679f2',
                    'product_name': '小米8',
                    'category_id': '530000197405044251',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/8ef279',
            'category_id': '81000020130124604X',
          },
          {
            'category_name': '新品',
            'category_list': [
              {
                'category_title': '手机配件',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279b2',
                    'product_name': '小米8 SE',
                    'category_id': '620000198901244849',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79d5f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '420000198804226916',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2eb79',
                    'product_name': '小米8',
                    'category_id': '450000197412300698',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/c879f2',
                    'product_name': '小米8 SE',
                    'category_id': '540000201602056535',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2a5',
                    'product_name': '小米MIX 2S',
                    'category_id': '150000200512276422',
                  }],
              },
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/f28179',
                    'product_name': '小米8',
                    'category_id': '340000198412010120',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/7993f2',
                    'product_name': '小米8 SE',
                    'category_id': '440000199207269422',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/b7f279',
                    'product_name': '小米MIX 2S',
                    'category_id': '650000198404101981',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279da',
                    'product_name': '小米8',
                    'category_id': '220000201603152516',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2e6',
                    'product_name': '小米8 SE',
                    'category_id': '500000200907234660',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2c379',
                    'product_name': '小米MIX 2S',
                    'category_id': '370000198912125771',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/9f79f2',
                    'product_name': '小米8',
                    'category_id': '65000020020524164X',
                  }],
              },
              {
                'category_title': '红米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f27c',
                    'product_name': '小米8 SE',
                    'category_id': '350000198005013684',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f27999',
                    'product_name': '小米MIX 2S',
                    'category_id': '650000197008057400',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79bcf2',
                    'product_name': '小米8',
                    'category_id': '350000199508158978',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/dff279',
                    'product_name': '小米8 SE',
                    'category_id': '340000198911053432',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/e179f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '650000199003288460',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2be',
                    'product_name': '小米8',
                    'category_id': '650000197011259249',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/f29a79',
            'category_id': '810000199611257545',
          },
          {
            'category_name': '手机',
            'category_list': [
              {
                'category_title': '手机配件',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/797af2',
                    'product_name': '小米8 SE',
                    'category_id': '440000200706154879',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/9ef279',
                    'product_name': '小米MIX 2S',
                    'category_id': '120000199210252889',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279c1',
                    'product_name': '小米8',
                    'category_id': '340000197810022720',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79e4f2',
                    'product_name': '小米8 SE',
                    'category_id': '710000200310157489',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2dc79',
                    'product_name': '小米MIX 2S',
                    'category_id': '350000197103130759',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/b879f2',
                    'product_name': '小米8',
                    'category_id': '370000201505112441',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f295',
                    'product_name': '小米8 SE',
                    'category_id': '520000199608051782',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2797f',
                    'product_name': '小米MIX 2S',
                    'category_id': '360000200404224114',
                  }],
              },
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79a3f2',
                    'product_name': '小米8',
                    'category_id': '340000198608109413',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/c6f279',
                    'product_name': '小米8 SE',
                    'category_id': '220000199709175150',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279ea',
                    'product_name': '小米MIX 2S',
                    'category_id': '36000019880506019X',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/79f2d7',
            'category_id': '36000019840426399X',
          },
          {
            'category_name': '电脑',
            'category_list': [
              {
                'category_title': '红米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2b379',
                    'product_name': '小米8',
                    'category_id': '460000201602142003',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/9079f2',
                    'product_name': '小米8 SE',
                    'category_id': '540000197301211387',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/85f279',
                    'product_name': '小米MIX 2S',
                    'category_id': '220000197009075440',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279a8',
                    'product_name': '小米8',
                    'category_id': '610000197709153852',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79cbf2',
                    'product_name': '小米8 SE',
                    'category_id': '530000199302112417',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/eff279',
                    'product_name': '小米MIX 2S',
                    'category_id': '520000199711237972',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/d179f2',
                    'product_name': '小米8',
                    'category_id': '120000199711115102',
                  }],
              },
              {
                'category_title': '手机配件',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2ae',
                    'product_name': '小米8 SE',
                    'category_id': '370000197710210439',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f28b79',
                    'product_name': '小米MIX 2S',
                    'category_id': '120000200802228634',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/798af2',
                    'product_name': '小米8',
                    'category_id': '130000200805162169',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/adf279',
                    'product_name': '小米8 SE',
                    'category_id': '610000199804170473',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/f279d1',
            'category_id': '350000199611195347',
          },
          {
            'category_name': '新品',
            'category_list': [
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2f0',
                    'product_name': '小米MIX 2S',
                    'category_id': '820000200512021657',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2cc79',
                    'product_name': '小米8',
                    'category_id': '820000198402014712',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/a979f2',
                    'product_name': '小米8 SE',
                    'category_id': '150000198907140730',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f286',
                    'product_name': '小米MIX 2S',
                    'category_id': '810000201603030447',
                  }],
              },
              {
                'category_title': '红米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2798f',
                    'product_name': '小米8',
                    'category_id': '43000019790225896X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79b2f2',
                    'product_name': '小米8 SE',
                    'category_id': '620000200304122288',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/d6f279',
                    'product_name': '小米MIX 2S',
                    'category_id': '510000200604114233',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/ea79f2',
                    'product_name': '小米8',
                    'category_id': '450000198704277738',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2c7',
                    'product_name': '小米8 SE',
                    'category_id': '320000197011091451',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2a479',
                    'product_name': '小米MIX 2S',
                    'category_id': '44000019770806475X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/8079f2',
                    'product_name': '小米8',
                    'category_id': '63000019851003394X',
                  }],
              },
              {
                'category_title': '手机配件',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/94f279',
                    'product_name': '小米8 SE',
                    'category_id': '710000201705233970',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279b7',
                    'product_name': '小米MIX 2S',
                    'category_id': '230000199503288741',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79dbf2',
                    'product_name': '小米8',
                    'category_id': '640000197308241208',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2e579',
                    'product_name': '小米8 SE',
                    'category_id': '360000201408144183',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/c279f2',
            'category_id': '420000200601256365',
          },
          {
            'category_name': '手机',
            'category_list': [
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f29f',
                    'product_name': '小米MIX 2S',
                    'category_id': '120000199707092825',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f27b79',
                    'product_name': '小米8',
                    'category_id': '450000201807105132',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/7999f2',
                    'product_name': '小米8 SE',
                    'category_id': '620000198412054585',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/bdf279',
                    'product_name': '小米MIX 2S',
                    'category_id': '630000197404072481',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279e0',
                    'product_name': '小米8',
                    'category_id': '350000201005150325',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2e0',
                    'product_name': '小米8 SE',
                    'category_id': '310000198410153253',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2bd79',
                    'product_name': '小米MIX 2S',
                    'category_id': '440000201407046872',
                  }],
              },
              {
                'category_title': '红米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/9979f2',
                    'product_name': '小米8',
                    'category_id': '510000199105053573',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/7bf279',
                    'product_name': '小米8 SE',
                    'category_id': '81000019930424666X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2799e',
                    'product_name': '小米MIX 2S',
                    'category_id': '530000197803195370',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79c2f2',
                    'product_name': '小米8',
                    'category_id': '820000198609297262',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/e5f279',
                    'product_name': '小米8 SE',
                    'category_id': '110000199001095352',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/db79f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '820000201304093669',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/79f2b8',
            'category_id': '130000200908181362',
          },
          {
            'category_name': '电脑',
            'category_list': [
              {
                'category_title': '手机配件',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/f29479',
                    'product_name': '小米8',
                    'category_id': '110000201608016382',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/7980f2',
                    'product_name': '小米8 SE',
                    'category_id': '410000200112226534',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/a4f279',
                    'product_name': '小米MIX 2S',
                    'category_id': '150000201408176389',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279c7',
                    'product_name': '小米8',
                    'category_id': '640000199309038999',
                  }],
              },
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79eaf2',
                    'product_name': '小米8 SE',
                    'category_id': '510000197701228326',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2d679',
                    'product_name': '小米MIX 2S',
                    'category_id': '650000200810308849',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/b379f2',
                    'product_name': '小米8',
                    'category_id': '520000198806287177',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f28f',
                    'product_name': '小米8 SE',
                    'category_id': '820000198511195209',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f27985',
                    'product_name': '小米MIX 2S',
                    'category_id': '540000201705068758',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79a9f2',
                    'product_name': '小米8',
                    'category_id': '130000197802171313',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/ccf279',
                    'product_name': '小米8 SE',
                    'category_id': '320000198609092154',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/f279ef',
            'category_id': '650000198602157222',
          },
          {
            'category_name': '新品',
            'category_list': [
              {
                'category_title': '红米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2d1',
                    'product_name': '小米MIX 2S',
                    'category_id': '460000197711191657',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2ad79',
                    'product_name': '小米8',
                    'category_id': '540000201505161245',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/8a79f2',
                    'product_name': '小米8 SE',
                    'category_id': '150000199003297350',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/8bf279',
                    'product_name': '小米MIX 2S',
                    'category_id': '450000198304244574',
                  }],
              },
              {
                'category_title': '手机配件',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279ae',
                    'product_name': '小米8',
                    'category_id': '420000199712134226',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79d1f2',
                    'product_name': '小米8 SE',
                    'category_id': '640000198807311631',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2ef79',
                    'product_name': '小米MIX 2S',
                    'category_id': '310000197904053549',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/cc79f2',
                    'product_name': '小米8',
                    'category_id': '370000197611194170',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2a8',
                    'product_name': '小米8 SE',
                    'category_id': '610000199804287460',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f28579',
                    'product_name': '小米MIX 2S',
                    'category_id': '360000200901035250',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/7990f2',
                    'product_name': '小米8',
                    'category_id': '610000199110053870',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/b3f279',
                    'product_name': '小米8 SE',
                    'category_id': '820000198810207679',
                  }],
              },
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279d6',
                    'product_name': '小米MIX 2S',
                    'category_id': '310000201403134382',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2ea',
                    'product_name': '小米8',
                    'category_id': '710000199407015553',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2c679',
                    'product_name': '小米8 SE',
                    'category_id': '350000201611272576',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/a379f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '31000019780320482X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f280',
                    'product_name': '小米8',
                    'category_id': '330000199210269540',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f27995',
                    'product_name': '小米8 SE',
                    'category_id': '410000199402098221',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79b8f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '810000198205076816',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/dcf279',
                    'product_name': '小米8',
                    'category_id': '640000200304080843',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/e579f2',
            'category_id': '140000197202030121',
          },
          {
            'category_name': '手机',
            'category_list': [
              {
                'category_title': '红米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2c1',
                    'product_name': '小米8 SE',
                    'category_id': '460000197701079311',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f29e79',
                    'product_name': '小米MIX 2S',
                    'category_id': '130000201005052679',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/7b79f2',
                    'product_name': '小米8',
                    'category_id': '23000019930510418X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/9af279',
                    'product_name': '小米8 SE',
                    'category_id': '500000198711165886',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279bd',
                    'product_name': '小米MIX 2S',
                    'category_id': '340000197103197863',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79e1f2',
                    'product_name': '小米8',
                    'category_id': '340000198008273367',
                  }],
              },
              {
                'category_title': '手机配件',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2df79',
                    'product_name': '小米8 SE',
                    'category_id': '320000197703193651',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/bc79f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '460000199405094516',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f299',
                    'product_name': '小米8',
                    'category_id': '510000201207233487',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2797c',
                    'product_name': '小米8 SE',
                    'category_id': '330000201602064309',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/799ff2',
                    'product_name': '小米MIX 2S',
                    'category_id': '620000200303058851',
                  }],
              },
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/c3f279',
                    'product_name': '小米8',
                    'category_id': '460000200705237625',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279e6',
                    'product_name': '小米8 SE',
                    'category_id': '210000197506147781',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2da',
                    'product_name': '小米MIX 2S',
                    'category_id': '460000198909152842',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/f2b779',
            'category_id': '370000201502181791',
          },
          {
            'category_name': '电脑',
            'category_list': [
              {
                'category_title': '红米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/9479f2',
                    'product_name': '小米8',
                    'category_id': '500000198105093851',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/81f279',
                    'product_name': '小米8 SE',
                    'category_id': '450000197603026409',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279a4',
                    'product_name': '小米MIX 2S',
                    'category_id': '820000197512238106',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79c8f2',
                    'product_name': '小米8',
                    'category_id': '500000200903132667',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/ebf279',
                    'product_name': '小米8 SE',
                    'category_id': '150000198802090415',
                  }],
              },
              {
                'category_title': '手机配件',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/d579f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '810000198203033265',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2b2',
                    'product_name': '小米8',
                    'category_id': '710000197112041253',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f28e79',
                    'product_name': '小米8 SE',
                    'category_id': '81000019780121618X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/7986f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '340000197303150349',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/aaf279',
            'category_id': '120000200703277393',
          },
          {
            'category_name': '新品',
            'category_list': [
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279cd',
                    'product_name': '小米8',
                    'category_id': '62000019980208504X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f0f2',
                    'product_name': '小米8 SE',
                    'category_id': '41000019950518582X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2d079',
                    'product_name': '小米MIX 2S',
                    'category_id': '420000198002248443',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/ad79f2',
                    'product_name': '小米8',
                    'category_id': '510000201404294254',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f289',
                    'product_name': '小米8 SE',
                    'category_id': '430000198004128834',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2798b',
                    'product_name': '小米MIX 2S',
                    'category_id': '44000019791120413X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79aff2',
                    'product_name': '小米8',
                    'category_id': '540000199703258718',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/d2f279',
                    'product_name': '小米8 SE',
                    'category_id': '460000197006119887',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/ee79f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '120000199308179472',
                  }],
              },
              {
                'category_title': '红米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2cb',
                    'product_name': '小米8',
                    'category_id': '140000198903119529',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2a779',
                    'product_name': '小米8 SE',
                    'category_id': '150000198605168244',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/8479f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '310000200305201639',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/90f279',
                    'product_name': '小米8',
                    'category_id': '120000201402104784',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279b4',
                    'product_name': '小米8 SE',
                    'category_id': '220000198805011733',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79d7f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '530000199009298670',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2e979',
                    'product_name': '小米8',
                    'category_id': '330000200205194287',
                  }],
              },
              {
                'category_title': '手机配件',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/c679f2',
                    'product_name': '小米8 SE',
                    'category_id': '530000200708309434',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2a2',
                    'product_name': '小米MIX 2S',
                    'category_id': '450000200711243325',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f27f79',
                    'product_name': '小米8',
                    'category_id': '130000198512154464',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/7996f2',
                    'product_name': '小米8 SE',
                    'category_id': '430000201907317892',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/b9f279',
                    'product_name': '小米MIX 2S',
                    'category_id': '15000020000424095X',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/f279dc',
            'category_id': '350000200603291836',
          },
          {
            'category_name': '手机',
            'category_list': [
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2e4',
                    'product_name': '小米8',
                    'category_id': '120000197212101516',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2c079',
                    'product_name': '小米8 SE',
                    'category_id': '460000197404148333',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/9d79f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '520000197207270088',
                  }],
              },
              {
                'category_title': '红米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f27a',
                    'product_name': '小米8',
                    'category_id': '640000199209144241',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2799b',
                    'product_name': '小米8 SE',
                    'category_id': '36000019970320138X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79bef2',
                    'product_name': '小米MIX 2S',
                    'category_id': '340000199005307773',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/e1f279',
            'category_id': '520000198012208211',
          },
          {
            'category_name': '电脑',
            'category_list': [
              {
                'category_title': '手机配件',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/df79f2',
                    'product_name': '小米8',
                    'category_id': '54000019751018555X',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f2bb',
                    'product_name': '小米8 SE',
                    'category_id': '500000198208049263',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f29879',
                    'product_name': '小米MIX 2S',
                    'category_id': '110000199704072851',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/797df2',
                    'product_name': '小米8',
                    'category_id': '370000197310245288',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/a0f279',
                    'product_name': '小米8 SE',
                    'category_id': '820000199402046356',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279c3',
                    'product_name': '小米MIX 2S',
                    'category_id': '710000201902216432',
                  }],
              },
              {
                'category_title': '小米手机',
                'category_group': [
                  {
                    'img_url': 'http://dummyimage.com/52x52/79e7f2',
                    'product_name': '小米8',
                    'category_id': '440000201404272479',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f2da79',
                    'product_name': '小米8 SE',
                    'category_id': '990000199504053772',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/b679f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '510000198602071700',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79f293',
                    'product_name': '小米8',
                    'category_id': '530000198606091040',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f27982',
                    'product_name': '小米8 SE',
                    'category_id': '500000199606217159',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/79a5f2',
                    'product_name': '小米MIX 2S',
                    'category_id': '460000199202097282',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/c8f279',
                    'product_name': '小米8',
                    'category_id': '430000200712223576',
                  },
                  {
                    'img_url': 'http://dummyimage.com/52x52/f279ec',
                    'product_name': '小米8 SE',
                    'category_id': '120000199112286364',
                  }],
              }],
            'category_img': 'http://dummyimage.com/260x104/79f2d4',
            'category_id': '500000199708252166',
          }],
      },
    };
  }

  async homePage() {
    this.ctx.body = {
      code: 0,
      data: {
        'tabs': [
          {
            'name': '推荐',
            'page_type': 'home',
            'page_id': 0,
            'is_default': false,
            'word_selected_color': '#ed5b00',
            'word_unselected_color': '#747474',
            'bg_img': '',
            'bg_img_webp': '',
          },
          {
            'name': '手机',
            'page_type': 'activity',
            'page_id': 8235,
            'is_default': false,
            'word_selected_color': '#ed5b00',
            'word_unselected_color': '#747474',
            'bg_img': '',
            'bg_img_webp': '',
          },
          {
            'name': '智能',
            'page_type': 'activity',
            'page_id': 10288,
            'is_default': false,
            'word_selected_color': '#ed5b00',
            'word_unselected_color': '#747474',
            'bg_img': '',
            'bg_img_webp': '',
          },
          {
            'name': '电视',
            'page_type': 'activity',
            'page_id': 10748,
            'is_default': false,
            'word_selected_color': '#ed5b00',
            'word_unselected_color': '#747474',
            'bg_img': '',
            'bg_img_webp': '',
          },
          {
            'name': '笔记本',
            'page_type': 'activity',
            'page_id': 9770,
            'is_default': false,
            'word_selected_color': '#ed5b00',
            'word_unselected_color': '#747474',
            'bg_img': '',
            'bg_img_webp': '',
          },
          {
            'name': '家电',
            'page_type': 'activity',
            'page_id': 8556,
            'is_default': false,
            'word_selected_color': '#ed5b00',
            'word_unselected_color': '#747474',
            'bg_img': '',
            'bg_img_webp': '',
          },
          {
            'name': '生活周边',
            'page_type': 'tab',
            'page_id': 1861,
            'is_default': false,
            'word_selected_color': '#ed5b00',
            'word_unselected_color': '#747474',
            'bg_img': '',
            'bg_img_webp': '',
          }], 'data': {
          'sections': [
            {
              'view_type': 'gallery', 'body': {
                'height': '0', 'width': '0', 'items': [
                  {
                    'w': 720,
                    'h': 360,
                    'material_id': 13461,
                    'ad_position_id': 2682,
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/c352beae76d56e4a98c48c8782a497b2.jpg?f=webp\u0026w=1080\u0026h=540\u0026bg=D6EAF3',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/c352beae76d56e4a98c48c8782a497b2.jpg?f=webp\u0026w=1080\u0026h=540\u0026bg=D6EAF3',
                    'img_url_color': '#D6EAF3',
                    'action': {
                      'type': 'product',
                      'path': '10000118',
                      'log_code': '31waphomegallery001001#t=ad\u0026act=product\u0026page=home\u0026pid=10000118\u0026page_id=26\u0026bid=3000164.1\u0026adp=2682\u0026adm=13461',
                    },
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'w': 720,
                    'h': 360,
                    'material_id': 13516,
                    'ad_position_id': 2491,
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/f08d593e99c34980480f9e2d395c80b4.jpg?f=webp\u0026w=1080\u0026h=540\u0026bg=397BE9',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/f08d593e99c34980480f9e2d395c80b4.jpg?f=webp\u0026w=1080\u0026h=540\u0026bg=397BE9',
                    'img_url_color': '#397BE9',
                    'action': {
                      'type': 'product',
                      'path': '10000157',
                      'log_code': '31waphomegallery002001#t=ad\u0026act=product\u0026page=home\u0026pid=10000157\u0026page_id=26\u0026bid=3000164.2\u0026adp=2491\u0026adm=13516',
                    },
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'w': 720,
                    'h': 360,
                    'material_id': 13659,
                    'ad_position_id': 2458,
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/ea5595f3878124f8bc3418d45a1e818e.jpg?f=webp\u0026w=1080\u0026h=540\u0026bg=AB0128',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/ea5595f3878124f8bc3418d45a1e818e.jpg?f=webp\u0026w=1080\u0026h=540\u0026bg=AB0128',
                    'img_url_color': '#AB0128',
                    'action': {
                      'type': 'product',
                      'path': '6222',
                      'log_code': '31waphomegallery003001#t=ad\u0026act=product\u0026page=home\u0026pid=6222\u0026page_id=26\u0026bid=3000164.3\u0026adp=2458\u0026adm=13659',
                    },
                    'margin_left': 0,
                    'margin_right': 0,
                  }], 'margin_left': 0, 'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill', 'is_show': 'Y', 'body': {
                'w': 720, 'h': 152, 'height': '0', 'width': '0', 'items': [
                  {
                    'w': 144,
                    'h': 152,
                    'material_id': 13361,
                    'ad_position_id': 3105,
                    'img_url': '//i8.mifile.cn/v1/a1/290976f3-acac-8a62-7e5c-a19985a6414b.webp?w=216\u0026h=228\u0026bg=FDEEE9',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/290976f3-acac-8a62-7e5c-a19985a6414b.webp?w=216\u0026h=228\u0026bg=FDEEE9',
                    'img_url_color': '#FDEEE9',
                    'action': {
                      'type': 'channel',
                      'path': '1852',
                      'log_code': '31waphomecells_auto_fill001002#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3441276.1\u0026adp=3105\u0026adm=13361',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'x': 144,
                    'w': 144,
                    'h': 152,
                    'material_id': 11608,
                    'ad_position_id': 3106,
                    'img_url': '//i8.mifile.cn/v1/a1/eb5024fe-dfe3-6e53-3e18-675bef5fa06e.webp?w=216\u0026h=228\u0026bg=EAF6FD',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/eb5024fe-dfe3-6e53-3e18-675bef5fa06e.webp?w=216\u0026h=228\u0026bg=EAF6FD',
                    'img_url_color': '#EAF6FD',
                    'action': {
                      'type': 'url',
                      'path': 'https://m.mi.com/crowdfunding/home',
                      'log_code': '31waphomecells_auto_fill002002#t=ad\u0026act=webview\u0026page=home\u0026page_id=26\u0026bid=3441276.2\u0026adp=3106\u0026adm=11608',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'x': 288,
                    'w': 144,
                    'h': 152,
                    'material_id': 13277,
                    'ad_position_id': 3107,
                    'img_url': '//i8.mifile.cn/v1/a1/26a132d9-c5ae-8a30-2705-f861e2e9f496.webp?w=216\u0026h=228\u0026bg=F3F4F5',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/26a132d9-c5ae-8a30-2705-f861e2e9f496.webp?w=216\u0026h=228\u0026bg=F3F4F5',
                    'img_url_color': '#F3F4F5',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/m/app/hd/index.html?id=10468',
                      'log_code': '31waphomecells_auto_fill003002#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3441276.3\u0026adp=3107\u0026adm=13277',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'x': 432,
                    'w': 144,
                    'h': 152,
                    'material_id': 9511,
                    'ad_position_id': 3108,
                    'img_url': '//i8.mifile.cn/v1/a1/e8bc849a-0a3b-21a0-6810-7da3a3903dee.webp?w=216\u0026h=228\u0026bg=FDEFDE',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/e8bc849a-0a3b-21a0-6810-7da3a3903dee.webp?w=216\u0026h=228\u0026bg=FDEFDE',
                    'img_url_color': '#FDEFDE',
                    'action': {
                      'type': 'url',
                      'path': 'https://s1.mi.com/pages/1f490b64a7d1716e9952d627b9baa45e/index.html',
                      'log_code': '31waphomecells_auto_fill004002#t=ad\u0026act=webview\u0026page=home\u0026page_id=26\u0026bid=3441276.4\u0026adp=3108\u0026adm=9511',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'x': 576,
                    'w': 144,
                    'h': 152,
                    'material_id': 13669,
                    'ad_position_id': 3116,
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/adf3091f560d0cd6d82ffbc1a9d89006.jpg?f=webp\u0026w=216\u0026h=228\u0026bg=FFFFFF',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/adf3091f560d0cd6d82ffbc1a9d89006.jpg?f=webp\u0026w=216\u0026h=228\u0026bg=FFFFFF',
                    'img_url_color': '#FFFFFF',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/m/app/hd/index.html?id=10758',
                      'log_code': '31waphomecells_auto_fill005002#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3441276.5\u0026adp=3116\u0026adm=13669',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }], 'margin_left': 0, 'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill', 'is_show': 'Y', 'body': {
                'w': 720, 'h': 152, 'height': '0', 'width': '0', 'items': [
                  {
                    'w': 144,
                    'h': 152,
                    'material_id': 9509,
                    'ad_position_id': 3110,
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/cb65daec7ef7b52cc785f88f78efba37.png?w=216\u0026h=228\u0026bg=FDF1E6',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/cb65daec7ef7b52cc785f88f78efba37.png?w=216\u0026h=228\u0026bg=FDF1E6',
                    'img_url_color': '#FDF1E6',
                    'action': {
                      'type': 'url',
                      'path': 'http://m.mi.com/seckill',
                      'log_code': '31waphomecells_auto_fill001003#t=ad\u0026act=webview\u0026page=home\u0026page_id=26\u0026bid=3441277.1\u0026adp=3110\u0026adm=9509',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'x': 144,
                    'w': 144,
                    'h': 152,
                    'material_id': 13030,
                    'ad_position_id': 3111,
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/9ea68dee2bfa0e55a82236b0d968e975.png?w=216\u0026h=228\u0026bg=FCEAEA',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/9ea68dee2bfa0e55a82236b0d968e975.png?w=216\u0026h=228\u0026bg=FCEAEA',
                    'img_url_color': '#FCEAEA',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/pages/b180da1593ce9ff93d453eccc44021ad/index.html',
                      'log_code': '31waphomecells_auto_fill002003#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3441277.2\u0026adp=3111\u0026adm=13030',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'x': 288,
                    'w': 144,
                    'h': 152,
                    'material_id': 13347,
                    'ad_position_id': 3112,
                    'img_url': '//i8.mifile.cn/v1/a1/feba5bde-a1fa-54b9-2663-8d91353c2fea.webp?w=216\u0026h=228\u0026bg=FCEFE1',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/feba5bde-a1fa-54b9-2663-8d91353c2fea.webp?w=216\u0026h=228\u0026bg=FCEFE1',
                    'img_url_color': '#FCEFE1',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/m/app/hd/index.html?id=10748',
                      'log_code': '31waphomecells_auto_fill003003#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3441277.3\u0026adp=3112\u0026adm=13347',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'x': 432,
                    'w': 144,
                    'h': 152,
                    'material_id': 11405,
                    'ad_position_id': 3113,
                    'img_url': '//i8.mifile.cn/v1/a1/e49720d6-3a48-ac6e-44d4-79f92b2e890c.webp?w=216\u0026h=228\u0026bg=F2F0FC',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/e49720d6-3a48-ac6e-44d4-79f92b2e890c.webp?w=216\u0026h=228\u0026bg=F2F0FC',
                    'img_url_color': '#F2F0FC',
                    'action': {
                      'type': 'channel',
                      'path': '8582',
                      'log_code': '31waphomecells_auto_fill004003#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3441277.4\u0026adp=3113\u0026adm=11405',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'x': 576,
                    'w': 144,
                    'h': 152,
                    'material_id': 9516,
                    'ad_position_id': 3115,
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/f11f9df6b0b0b428f8c8fc3267131830.png?w=216\u0026h=228\u0026bg=FDEDE8',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/f11f9df6b0b0b428f8c8fc3267131830.png?w=216\u0026h=228\u0026bg=FDEDE8',
                    'img_url_color': '#FDEDE8',
                    'action': {
                      'type': 'url',
                      'path': 'https://service.10046.mi.com/channel/',
                      'log_code': '31waphomecells_auto_fill005003#t=ad\u0026act=webview\u0026page=home\u0026page_id=26\u0026bid=3441277.5\u0026adp=3115\u0026adm=9516',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }], 'margin_left': 0, 'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '24',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill', 'is_show': 'Y', 'body': {
                'w': 720, 'h': 508, 'height': '0', 'width': '0', 'items': [
                  {
                    'w': 358,
                    'h': 508,
                    'material_id': 13410,
                    'ad_position_id': 1993,
                    'img_url': '//i8.mifile.cn/v1/a1/dbac8d88-17f5-3514-d70b-fe1e8c09a0f7.webp?w=537\u0026h=762\u0026bg=AFB0BB',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/dbac8d88-17f5-3514-d70b-fe1e8c09a0f7.webp?w=537\u0026h=762\u0026bg=AFB0BB',
                    'img_url_color': '#AFB0BB',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/pages/9f9a2e9ab3dc74b58ef7c5b974807751/index.html',
                      'log_code': '31waphomecells_auto_fill001005#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3000169.1\u0026adp=1993\u0026adm=13410',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'x': 362,
                    'w': 358,
                    'h': 252,
                    'material_id': 13654,
                    'ad_position_id': 1994,
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/b14fff7134c295fc49137687995e2d46.jpg?f=webp\u0026w=537\u0026h=378\u0026bg=F4FCFF',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/b14fff7134c295fc49137687995e2d46.jpg?f=webp\u0026w=537\u0026h=378\u0026bg=F4FCFF',
                    'img_url_color': '#F4FCFF',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/m/app/hd/index.html?id=10288',
                      'log_code': '31waphomecells_auto_fill002005#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3000169.2\u0026adp=1994\u0026adm=13654',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'x': 362,
                    'y': 256,
                    'w': 358,
                    'h': 252,
                    'material_id': 13661,
                    'ad_position_id': 1995,
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/20e5405107794c317d4dadd02573d112.jpg?f=webp\u0026w=537\u0026h=378\u0026bg=F4F4FF',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/20e5405107794c317d4dadd02573d112.jpg?f=webp\u0026w=537\u0026h=378\u0026bg=F4F4FF',
                    'img_url_color': '#F4F4FF',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/m/app/hd/index.html?id=10748',
                      'log_code': '31waphomecells_auto_fill003005#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3000169.3\u0026adp=1995\u0026adm=13661',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }], 'margin_left': 0, 'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#ffffff',
                'line_height': '6',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill',
              'block_id': '3475097',
              'body': {
                'bg_color': '#ffffff',
                'w': 720,
                'h': 252,
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'w': 360,
                    'h': 252,
                    'img_url': '//i8.mifile.cn/v1/a1/139eeb1a-95ac-d278-4b1e-e2fb05798908.webp',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/139eeb1a-95ac-d278-4b1e-e2fb05798908.webp',
                    'img_url_color': '#D8D4D1',
                    'action': {
                      'type': 'product',
                      'path': '10000131',
                      'log_code': '31waphomecells_auto_fill001007#t=normal\u0026act=product\u0026page=home\u0026pid=10000131\u0026page_id=26\u0026bid=3475097.1',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'x': 360,
                    'w': 360,
                    'h': 252,
                    'img_url': '//i8.mifile.cn/v1/a1/1074a94c-0594-5ddd-7e53-2667d27e8e36.webp',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/1074a94c-0594-5ddd-7e53-2667d27e8e36.webp',
                    'img_url_color': '#D7C6E3',
                    'action': {
                      'type': 'product',
                      'path': '9455',
                      'log_code': '31waphomecells_auto_fill002007#t=normal\u0026act=product\u0026page=home\u0026pid=9455\u0026page_id=26\u0026bid=3475097.2',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'recommend_flag': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '24',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill',
              'is_show': 'Y',
              'body': {
                'w': 720,
                'h': 280,
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'w': 720,
                    'h': 280,
                    'material_id': 13639,
                    'ad_position_id': 2972,
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/d23a40676be94076239963be3d0135f7.jpg?f=webp\u0026w=1080\u0026h=420\u0026bg=575FC1',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/d23a40676be94076239963be3d0135f7.jpg?f=webp\u0026w=1080\u0026h=420\u0026bg=575FC1',
                    'img_url_color': '#575FC1',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/m/app/hd/index.html?id=10721',
                      'log_code': '31waphomecells_auto_fill001009#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3474856.1\u0026adp=2972\u0026adm=13639',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '24',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill',
              'is_show': 'Y',
              'body': {
                'w': 720,
                'h': 440,
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'w': 720,
                    'h': 440,
                    'material_id': 13629,
                    'ad_position_id': 2038,
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/7393327379c18d4eec0b0daaa935a065.jpg?f=webp\u0026w=1080\u0026h=660\u0026bg=FFFFFF',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/7393327379c18d4eec0b0daaa935a065.jpg?f=webp\u0026w=1080\u0026h=660\u0026bg=FFFFFF',
                    'img_url_color': '#FFFFFF',
                    'action': {
                      'type': 'product',
                      'path': '10000164',
                      'log_code': '31waphomecells_auto_fill001011#t=ad\u0026act=product\u0026page=home\u0026pid=10000164\u0026page_id=26\u0026bid=3182278.1\u0026adp=2038\u0026adm=13629',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#ffffff',
                'line_height': '10',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_two_type13', 'body': {
                'bg_color': '#ffffff',
                'btn_txt_color': '#ffffff',
                'btn_color': '#ea625b',
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'img_url': '//i8.mifile.cn/v1/a1/b7aa0b1e-90bb-725d-fbd1-1bb26a051606.webp?w=516\u0026h=420',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/b7aa0b1e-90bb-725d-fbd1-1bb26a051606.webp?w=516\u0026h=420',
                    'img_url_color': '#B0A1A8',
                    'action': {
                      'type': 'product',
                      'path': '10000085',
                      'log_code': '31waphomelist_two_type13001013#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475062.1\u0026pid=10000085',
                    },
                    'show_price_qi': true,
                    'product_id': '10000085',
                    'product_name': '小米MIX 2S',
                    'product_brief': '四曲面陶瓷机身，骁龙845',
                    'product_price': '1999',
                    'product_org_price': '2999',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'img_url': '//i8.mifile.cn/v1/a1/b7ad9e53-bc1e-dcc9-3175-3221cc043d64.webp?w=516\u0026h=420',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/b7ad9e53-bc1e-dcc9-3175-3221cc043d64.webp?w=516\u0026h=420',
                    'img_url_color': '#9FA0AE',
                    'action': {
                      'type': 'product',
                      'path': '10000123',
                      'log_code': '31waphomelist_two_type13002013#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475062.2\u0026pid=10000123',
                    },
                    'product_id': '10000123',
                    'product_name': '小米MIX 3',
                    'product_brief': 'DxO百分拍照手机',
                    'product_price': '2999',
                    'product_org_price': '3599',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#ffffff',
                'line_height': '10',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_two_type13', 'body': {
                'bg_color': '#ffffff',
                'btn_txt_color': '#ffffff',
                'btn_color': '#ea625b',
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/dc1255fd3e70b6cdd6409627ca59d3f7.jpg?w=516\u0026h=420',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/dc1255fd3e70b6cdd6409627ca59d3f7.jpg?w=516\u0026h=420',
                    'img_url_color': '#919AB9',
                    'action': {
                      'type': 'product',
                      'path': '10000151',
                      'log_code': '31waphomelist_two_type13001015#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475064.1\u0026pid=10000151',
                    },
                    'show_price_qi': true,
                    'product_id': '10000151',
                    'product_name': 'Redmi K20 Pro ',
                    'product_brief': '骁龙855， 弹出全面屏',
                    'product_price': '2499',
                    'product_org_price': '2499',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/bb2ebb6fadaf67dfe765ce5866daac62.jpg',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/bb2ebb6fadaf67dfe765ce5866daac62.jpg',
                    'img_url_color': '#9E9FBB',
                    'action': {
                      'type': 'product',
                      'path': '10000118',
                      'log_code': '31waphomelist_two_type13002015#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475064.2\u0026pid=10000118',
                    },
                    'product_id': '10000118',
                    'product_name': '小米8 屏幕指纹版',
                    'product_brief': '6GB+128GB特惠',
                    'product_price': '1799',
                    'product_org_price': '2999',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#ffffff',
                'line_height': '10',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_two_type13', 'body': {
                'bg_color': '#ffffff',
                'btn_txt_color': '#ffffff',
                'btn_color': '#ea625b',
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/baf1995a35e823c99e7c8ffd287d64ee.jpg?f=webp\u0026w=516\u0026h=420',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/baf1995a35e823c99e7c8ffd287d64ee.jpg?f=webp\u0026w=516\u0026h=420',
                    'img_url_color': '#F5F5F5',
                    'action': {
                      'type': 'product',
                      'path': '10000134',
                      'log_code': '31waphomelist_two_type13001017#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475066.1\u0026pid=10000134',
                    },
                    'show_price_qi': true,
                    'product_id': '10000134',
                    'product_name': '小米9',
                    'product_brief': '全息幻彩机身，骁龙855',
                    'product_price': '2799',
                    'product_org_price': '2999',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'img_url': '//i8.mifile.cn/v1/a1/4770987f-6e65-1960-61b3-43fdb2c1b104.webp',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/4770987f-6e65-1960-61b3-43fdb2c1b104.webp',
                    'img_url_color': '#9598B6',
                    'action': {
                      'type': 'product',
                      'path': '10000117',
                      'log_code': '31waphomelist_two_type13002017#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475066.2\u0026pid=10000117',
                    },
                    'show_price_qi': true,
                    'product_id': '10000117',
                    'product_name': '小米8 青春版',
                    'product_brief': '索尼2400万自拍，超级夜景',
                    'product_price': '1299',
                    'product_org_price': '1799',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#ffffff',
                'line_height': '10',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_two_type13', 'body': {
                'bg_color': '#ffffff',
                'btn_txt_color': '#ffffff',
                'btn_color': '#ea625b',
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/f5e8faabd72ee160e245447357f1708e.jpg?f=webp\u0026w=516\u0026h=420',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/f5e8faabd72ee160e245447357f1708e.jpg?f=webp\u0026w=516\u0026h=420',
                    'img_url_color': '#F5F5F5',
                    'action': {
                      'type': 'product',
                      'path': '10000138',
                      'log_code': '31waphomelist_two_type13001019#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475068.1\u0026pid=10000138',
                    },
                    'show_price_qi': true,
                    'product_id': '10000138',
                    'product_name': 'Redmi 7 ',
                    'product_brief': '4000mAh超长续航',
                    'product_price': '699',
                    'product_org_price': '699',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'img_url': '//i8.mifile.cn/v1/a1/111cd2ee-0e6a-b286-d713-30a7fce817a3.webp',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/111cd2ee-0e6a-b286-d713-30a7fce817a3.webp',
                    'img_url_color': '#969899',
                    'action': {
                      'type': 'product',
                      'path': '10000139',
                      'log_code': '31waphomelist_two_type13002019#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475068.2\u0026pid=10000139',
                    },
                    'show_price_qi': true,
                    'product_id': '10000139',
                    'product_name': '黑鲨游戏手机 2',
                    'product_brief': '骁龙855，立体触控',
                    'product_price': '2999',
                    'product_org_price': '3499',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#cecece',
                'line_height': '2',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_action_title',
              'block_id': '3421723',
              'body': {
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'action_title': '更多小米手机产品',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/pages/9f9a2e9ab3dc74b58ef7c5b974807751/index.html',
                      'log_code': '31waphomelist_action_title001021#t=normal\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3421723.1',
                    },
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '24',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill',
              'is_show': 'Y',
              'body': {
                'w': 720,
                'h': 280,
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'w': 720,
                    'h': 280,
                    'material_id': 13527,
                    'ad_position_id': 1254,
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/643896b404730a02bda861160946e2a0.jpg?f=webp\u0026w=1080\u0026h=420\u0026bg=D1ECD9',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/643896b404730a02bda861160946e2a0.jpg?f=webp\u0026w=1080\u0026h=420\u0026bg=D1ECD9',
                    'img_url_color': '#D1ECD9',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/m/app/hd/index.html?id=10664',
                      'log_code': '31waphomecells_auto_fill001023#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3324199.1\u0026adp=1254\u0026adm=13527',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '24',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill',
              'is_show': 'Y',
              'body': {
                'w': 720,
                'h': 440,
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'w': 720,
                    'h': 440,
                    'material_id': 13665,
                    'ad_position_id': 1467,
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/9bff8f8b960ecb373f06f9f0aab6c958.jpg?f=webp\u0026w=1080\u0026h=660\u0026bg=FFFFFF',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/9bff8f8b960ecb373f06f9f0aab6c958.jpg?f=webp\u0026w=1080\u0026h=660\u0026bg=FFFFFF',
                    'img_url_color': '#FFFFFF',
                    'action': {
                      'type': 'product',
                      'path': '7911',
                      'log_code': '31waphomecells_auto_fill001025#t=ad\u0026act=product\u0026page=home\u0026pid=7911\u0026page_id=26\u0026bid=3053444.1\u0026adp=1467\u0026adm=13665',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#ffffff',
                'line_height': '10',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_two_type13', 'body': {
                'bg_color': '#ffffff',
                'btn_txt_color': '#ffffff',
                'btn_color': '#ea625b',
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'img_url': '//i8.mifile.cn/v1/a1/82003442-c6b7-3258-cc7a-2a851216ce8a.webp?w=516\u0026h=420',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/82003442-c6b7-3258-cc7a-2a851216ce8a.webp?w=516\u0026h=420',
                    'img_url_color': '#888787',
                    'action': {
                      'type': 'product',
                      'path': '5353',
                      'log_code': '31waphomelist_two_type13001027#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475069.1\u0026pid=5353',
                    },
                    'product_id': '5353',
                    'product_name': '小米电视4A 65英寸',
                    'product_brief': '4K HDR，人工智能语音系统',
                    'product_price': '2899',
                    'product_org_price': '2999',
                    'product_rebate': {
                      '1': '约返2.90元',
                      '2': '约返2.90元',
                      '3': '约返2.90元',
                      '4': '约返2.90元',
                      '5': '约返2.90元',
                    },
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/7cd59729b9a02407979848839c0e5343.jpg',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/7cd59729b9a02407979848839c0e5343.jpg',
                    'img_url_color': '#B9B1B5',
                    'action': {
                      'type': 'product',
                      'path': '8912',
                      'log_code': '31waphomelist_two_type13002027#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475069.2\u0026pid=8912',
                    },
                    'product_id': '8912',
                    'product_name': '小米电视4X 43英寸',
                    'product_brief': 'FHD全高清屏，人工智能语音',
                    'product_price': '1199',
                    'product_org_price': '1499',
                    'product_rebate': {
                      '1': '约返1.20元',
                      '2': '约返1.20元',
                      '3': '约返1.20元',
                      '4': '约返1.20元',
                      '5': '约返1.20元',
                    },
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#ffffff',
                'line_height': '10',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_two_type13', 'body': {
                'bg_color': '#ffffff',
                'btn_txt_color': '#ffffff',
                'btn_color': '#ea625b',
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/896d989bcdae584906c36f4a4e5fa89b.jpg?w=516\u0026h=420',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/896d989bcdae584906c36f4a4e5fa89b.jpg?w=516\u0026h=420',
                    'img_url_color': '#FFFFFF',
                    'action': {
                      'type': 'product',
                      'path': '7795',
                      'log_code': '31waphomelist_two_type13001029#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475071.1\u0026pid=7795',
                    },
                    'product_id': '7795',
                    'product_name': '小米电视4C 50英寸',
                    'product_brief': '4K HDR，钢琴烤漆',
                    'product_price': '1599',
                    'product_org_price': '1699',
                    'product_rebate': {
                      '1': '约返1.60元',
                      '2': '约返1.60元',
                      '3': '约返1.60元',
                      '4': '约返1.60元',
                      '5': '约返1.60元',
                    },
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/4b624a157d24822509e1f54316c8417a.jpg',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/4b624a157d24822509e1f54316c8417a.jpg',
                    'img_url_color': '#BEC5C8',
                    'action': {
                      'type': 'product',
                      'path': '6628',
                      'log_code': '31waphomelist_two_type13002029#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475071.2\u0026pid=6628',
                    },
                    'product_id': '6628',
                    'product_name': '小米电视4C 55英寸',
                    'product_brief': '4K HDR，人工智能系统',
                    'product_price': '1999',
                    'product_org_price': '1999',
                    'product_rebate': {
                      '1': '约返2.00元',
                      '2': '约返2.00元',
                      '3': '约返2.00元',
                      '4': '约返2.00元',
                      '5': '约返2.00元',
                    },
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#ffffff',
                'line_height': '10',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_two_type13', 'body': {
                'bg_color': '#ffffff',
                'btn_txt_color': '#ffffff',
                'btn_color': '#ea625b',
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/3d20e4c39b6967319e89b1f779332b0e.jpg?w=516\u0026h=420',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/3d20e4c39b6967319e89b1f779332b0e.jpg?w=516\u0026h=420',
                    'img_url_color': '#C3AEA1',
                    'action': {
                      'type': 'product',
                      'path': '6222',
                      'log_code': '31waphomelist_two_type13001031#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475073.1\u0026pid=6222',
                    },
                    'product_id': '6222',
                    'product_name': '小米电视4A 32英寸',
                    'product_brief': '人工智能系统，高清液晶屏',
                    'product_price': '699',
                    'product_org_price': '799',
                    'product_rebate': {
                      '1': '约返0.70元',
                      '2': '约返0.70元',
                      '3': '约返0.70元',
                      '4': '约返0.70元',
                      '5': '约返10.49元',
                    },
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/06bd0cdc9a6d3cc76850633a8ffb9d74.png?w=516\u0026h=420',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/06bd0cdc9a6d3cc76850633a8ffb9d74.png?w=516\u0026h=420',
                    'img_url_color': '#C5A8A1',
                    'action': {
                      'type': 'product',
                      'path': '7575',
                      'log_code': '31waphomelist_two_type13002031#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475073.2\u0026pid=7575',
                    },
                    'product_id': '7575',
                    'product_name': '小米电视4A 50英寸',
                    'product_brief': '4K HDR，人工智能语音系统',
                    'product_price': '1599',
                    'product_org_price': '1699',
                    'product_tag_array': ['//cdn.cnbj1.fds.api.mi-img.com/mi-mall/9898bae27e7e30369839b8e5b326e58c.png?w=167\u0026h=167'],
                    'product_rebate': {
                      '1': '约返1.60元',
                      '2': '约返1.60元',
                      '3': '约返1.60元',
                      '4': '约返1.60元',
                      '5': '约返47.97元',
                    },
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#cecece',
                'line_height': '2',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_action_title',
              'block_id': '3482078',
              'body': {
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'action_title': '更多小米电视产品',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/m/app/hd/index.html?id=10748',
                      'log_code': '31waphomelist_action_title001034#t=normal\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3482078.1',
                    },
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '24',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill',
              'is_show': 'Y',
              'body': {
                'w': 720,
                'h': 280,
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'w': 720,
                    'h': 280,
                    'material_id': 13404,
                    'ad_position_id': 1354,
                    'img_url': '//i8.mifile.cn/v1/a1/76cb8a72-645e-2359-0481-b183daa81ccb.webp?w=1080\u0026h=420\u0026bg=A7C6DC',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/76cb8a72-645e-2359-0481-b183daa81ccb.webp?w=1080\u0026h=420\u0026bg=A7C6DC',
                    'img_url_color': '#A7C6DC',
                    'action': {
                      'type': 'product',
                      'path': '9668',
                      'log_code': '31waphomecells_auto_fill001036#t=ad\u0026act=product\u0026page=home\u0026pid=9668\u0026page_id=26\u0026bid=3039085.1\u0026adp=1354\u0026adm=13404',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '24',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill',
              'is_show': 'Y',
              'body': {
                'w': 720,
                'h': 440,
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'w': 720,
                    'h': 440,
                    'material_id': 10044,
                    'ad_position_id': 2831,
                    'img_url': '//i8.mifile.cn/v1/a1/2627319b-cb4c-6c13-2c96-c18286c1f34e.webp?w=1080\u0026h=660\u0026bg=BAC8C5',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/2627319b-cb4c-6c13-2c96-c18286c1f34e.webp?w=1080\u0026h=660\u0026bg=BAC8C5',
                    'img_url_color': '#BAC8C5',
                    'action': {
                      'type': 'product',
                      'path': '10000140',
                      'log_code': '31waphomecells_auto_fill001038#t=ad\u0026act=product\u0026page=home\u0026pid=10000140\u0026page_id=26\u0026bid=3376108.1\u0026adp=2831\u0026adm=10044',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#ffffff',
                'line_height': '10',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_two_type13', 'body': {
                'bg_color': '#ffffff',
                'btn_txt_color': '#ffffff',
                'btn_color': '#ea625b',
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/4d241596004d7cafafcad0b9a17638e8.jpg',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/4d241596004d7cafafcad0b9a17638e8.jpg',
                    'img_url_color': '#B69BAD',
                    'action': {
                      'type': 'product',
                      'path': '9511',
                      'log_code': '31waphomelist_two_type13001040#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475074.1\u0026pid=9511',
                    },
                    'product_id': '9511',
                    'product_name': 'Air 12.5" 2019款',
                    'product_brief': '像杂志一样随身携带',
                    'product_price': '3599',
                    'product_org_price': '3599',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/399cfcaa4aae2766733e46704935bdd4.jpg',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/399cfcaa4aae2766733e46704935bdd4.jpg',
                    'img_url_color': '#9C959D',
                    'action': {
                      'type': 'product',
                      'path': '10000142',
                      'log_code': '31waphomelist_two_type13002040#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475074.2\u0026pid=10000142',
                    },
                    'show_price_qi': true,
                    'product_id': '10000142',
                    'product_name': 'Air 13.3" 2019款',
                    'product_brief': '新一代独立显卡',
                    'product_price': '4999',
                    'product_org_price': '4999',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#ffffff',
                'line_height': '10',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_two_type13', 'body': {
                'bg_color': '#ffffff',
                'btn_txt_color': '#ffffff',
                'btn_color': '#ea625b',
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/43f9a118c5f742b9a29360beda770dcd.jpg',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/43f9a118c5f742b9a29360beda770dcd.jpg',
                    'img_url_color': '#A19EA7',
                    'action': {
                      'type': 'product',
                      'path': '10000144',
                      'log_code': '31waphomelist_two_type13001042#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475076.1\u0026pid=10000144',
                    },
                    'show_price_qi': true,
                    'product_id': '10000144',
                    'product_name': 'Pro 15.6" 2019款',
                    'product_brief': '强悍的专业笔记本',
                    'product_price': '4999',
                    'product_org_price': '5599',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/ff646eb3db372e455a7154331fa58d53.jpg',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/ff646eb3db372e455a7154331fa58d53.jpg',
                    'img_url_color': '#B49D94',
                    'action': {
                      'type': 'product',
                      'path': '10000141',
                      'log_code': '31waphomelist_two_type13002042#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475076.2\u0026pid=10000141',
                    },
                    'show_price_qi': true,
                    'product_id': '10000141',
                    'product_name': '笔记本15.6"  独显版',
                    'product_brief': '全面均衡的国民轻薄本',
                    'product_price': '3799',
                    'product_org_price': '3999',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#ffffff',
                'line_height': '10',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_two_type13', 'body': {
                'bg_color': '#ffffff',
                'btn_txt_color': '#ffffff',
                'btn_color': '#ea625b',
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'img_url': '//i8.mifile.cn/v1/a1/1ed6a607-21e5-8d85-e0e9-dfb07571fc6a.webp',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/1ed6a607-21e5-8d85-e0e9-dfb07571fc6a.webp',
                    'img_url_color': '#8987AD',
                    'action': {
                      'type': 'product',
                      'path': '10000113',
                      'log_code': '31waphomelist_two_type13001044#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475078.1\u0026pid=10000113',
                    },
                    'show_price_qi': true,
                    'product_id': '10000113',
                    'product_name': '小米游戏本',
                    'product_brief': '冷酷的性能怪兽\u0009',
                    'product_price': '6499',
                    'product_org_price': '6699',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/4f09569618c64e3f6f36d1be6922e3cc.jpg',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/4f09569618c64e3f6f36d1be6922e3cc.jpg',
                    'img_url_color': '#A19DA7',
                    'action': {
                      'type': 'product',
                      'path': '10000114',
                      'log_code': '31waphomelist_two_type13002044#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3475078.2\u0026pid=10000114',
                    },
                    'show_price_qi': true,
                    'product_id': '10000114',
                    'product_name': 'Pro 15.6" GTX版',
                    'product_brief': '更强悍的专业笔记本',
                    'product_price': '6299',
                    'product_org_price': '6299',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#cecece',
                'line_height': '2',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_action_title',
              'block_id': '3376114',
              'body': {
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'action_title': '更多小米笔记本产品',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/pages/b180da1593ce9ff93d453eccc44021ad/index.html',
                      'log_code': '31waphomelist_action_title001046#t=normal\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3376114.1',
                    },
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '24',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill',
              'is_show': 'Y',
              'body': {
                'w': 720,
                'h': 280,
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'w': 720,
                    'h': 280,
                    'material_id': 12635,
                    'ad_position_id': 2873,
                    'img_url': '//i8.mifile.cn/v1/a1/d6b40e14-634f-a864-7a46-43090cdf3b9c.webp?w=1080\u0026h=420\u0026bg=CACEDC',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/d6b40e14-634f-a864-7a46-43090cdf3b9c.webp?w=1080\u0026h=420\u0026bg=CACEDC',
                    'img_url_color': '#CACEDC',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/pages/b180da1593ce9ff93d453eccc44021ad/index.html',
                      'log_code': '31waphomecells_auto_fill001048#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3000185.1\u0026adp=2873\u0026adm=12635',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '24',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill',
              'is_show': 'Y',
              'body': {
                'w': 720,
                'h': 440,
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'w': 720,
                    'h': 440,
                    'material_id': 13240,
                    'ad_position_id': 2981,
                    'img_url': '//i8.mifile.cn/v1/a1/00ddbb35-3240-2e52-8f59-7038b0eca62e.webp?w=1080\u0026h=660\u0026bg=E3E8EE',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/00ddbb35-3240-2e52-8f59-7038b0eca62e.webp?w=1080\u0026h=660\u0026bg=E3E8EE',
                    'img_url_color': '#E3E8EE',
                    'action': {
                      'type': 'product',
                      'path': '9558',
                      'log_code': '31waphomecells_auto_fill001050#t=ad\u0026act=product\u0026page=home\u0026pid=9558\u0026page_id=26\u0026bid=3414217.1\u0026adp=2981\u0026adm=13240',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '6',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_two_type1', 'body': {
                'height': '0', 'width': '0', 'items': [
                  {
                    'img_url': '//i8.mifile.cn/v1/a1/c585ed38-bee4-2f3c-c413-a1af154a74b3.webp?w=1080\u0026h=1080',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/c585ed38-bee4-2f3c-c413-a1af154a74b3.webp?w=1080\u0026h=1080',
                    'img_url_color': '#F0F0F0',
                    'action': {
                      'type': 'product',
                      'path': '9144',
                      'log_code': '31waphomelist_two_type1001052#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3415695.1\u0026pid=9144',
                    },
                    'btn_txt': '立即购买',
                    'product_id': '9144',
                    'product_name': '米家互联网空调（一级能效）',
                    'product_brief': '1.5匹，全直流变频',
                    'product_price': '2199',
                    'product_org_price': '2699',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/552e42b8706ee8d0bd3e048d2a5c4316.jpg?w=1080\u0026h=1080',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/552e42b8706ee8d0bd3e048d2a5c4316.jpg?w=1080\u0026h=1080',
                    'img_url_color': '#C88283',
                    'action': {
                      'type': 'product',
                      'path': '9963',
                      'log_code': '31waphomelist_two_type1002052#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3415695.2\u0026pid=9963',
                    },
                    'btn_txt': '立即预约',
                    'product_id': '9963',
                    'product_name': '米家洗烘一体机Pro',
                    'product_brief': '支持语音遥控、智能投放',
                    'product_price': '2999',
                    'product_org_price': '2999',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  }], 'margin_left': 0, 'margin_right': 0,
              },
            },
            {
              'view_type': 'list_two_type1', 'body': {
                'height': '0', 'width': '0', 'items': [
                  {
                    'img_url': '//i8.mifile.cn/v1/a1/75f5a1ad-e2c6-36a9-fd56-66d253cc0469.webp?w=1080\u0026h=1080',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/75f5a1ad-e2c6-36a9-fd56-66d253cc0469.webp?w=1080\u0026h=1080',
                    'img_url_color': '#F0F0F0',
                    'action': {
                      'type': 'product',
                      'path': '9183',
                      'log_code': '31waphomelist_two_type1001053#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3415696.1\u0026pid=9183',
                    },
                    'btn_txt': '立即购买',
                    'product_id': '9183',
                    'product_name': '米家空调',
                    'product_brief': '大1匹，静音，快速制冷热',
                    'product_price': '1499',
                    'product_org_price': '1799',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'img_url': '//i8.mifile.cn/v1/a1/27721d21-782a-32e8-772b-462652d9acde.webp?w=1080\u0026h=1080',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/27721d21-782a-32e8-772b-462652d9acde.webp?w=1080\u0026h=1080',
                    'img_url_color': '#9EB0BA',
                    'action': {
                      'type': 'product',
                      'path': '9161',
                      'log_code': '31waphomelist_two_type1002053#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3415696.2\u0026pid=9161',
                    },
                    'btn_txt': '立即购买',
                    'product_id': '9161',
                    'product_name': '米家洗烘一体机',
                    'product_brief': '洗得净、烘得干',
                    'product_price': '1999',
                    'product_org_price': '2299',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  }], 'margin_left': 0, 'margin_right': 0,
              },
            },
            {
              'view_type': 'list_two_type1', 'body': {
                'height': '0', 'width': '0', 'items': [
                  {
                    'img_url': '//i8.mifile.cn/v1/a1/ce8d4b39-18b3-5b8e-ea74-5a2c86856e20.webp?w=1080\u0026h=1080',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/ce8d4b39-18b3-5b8e-ea74-5a2c86856e20.webp?w=1080\u0026h=1080',
                    'img_url_color': '#E4EAEC',
                    'action': {
                      'type': 'product',
                      'path': '9558',
                      'log_code': '31waphomelist_two_type1001054#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3414221.1\u0026pid=9558',
                    },
                    'product_id': '9558',
                    'product_name': '米家互联网空调C1（一级能效）',
                    'product_brief': '1.5匹，自清洁，全直流变频',
                    'product_price': '2299',
                    'product_org_price': '2799',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'img_url': '//i8.mifile.cn/v1/a1/33c6d391-82a0-0fd2-2d0e-fb59f4679b6c.webp?w=1080\u0026h=1080',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/33c6d391-82a0-0fd2-2d0e-fb59f4679b6c.webp?w=1080\u0026h=1080',
                    'img_url_color': '#CFE2D8',
                    'action': {
                      'type': 'product',
                      'path': '9509',
                      'log_code': '31waphomelist_two_type1002054#t=product\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3414221.2\u0026pid=9509',
                    },
                    'product_id': '9509',
                    'product_name': 'Redmi波轮洗衣机1A',
                    'product_brief': '大容量一次洗净全家衣物',
                    'product_price': '699',
                    'product_org_price': '799',
                    'product_rebate': {},
                    'margin_left': 0,
                    'margin_right': 0,
                  }], 'margin_left': 0, 'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#cecece',
                'line_height': '2',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_action_title',
              'block_id': '3414223',
              'body': {
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'action_title': '更多米家家电产品',
                    'action': {
                      'type': 'channel',
                      'path': '8582',
                      'log_code': '31waphomelist_action_title001056#t=normal\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3414223.1',
                    },
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '24',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill',
              'is_show': 'Y',
              'body': {
                'w': 720,
                'h': 280,
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'w': 720,
                    'h': 280,
                    'material_id': 13630,
                    'ad_position_id': 192,
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/b6756309a41b8a56b00a0c22fd32073c.jpg?f=webp\u0026w=1080\u0026h=420\u0026bg=15BD3',
                    'img_url_webp': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/b6756309a41b8a56b00a0c22fd32073c.jpg?f=webp\u0026w=1080\u0026h=420\u0026bg=15BD3',
                    'img_url_color': '#15BD3',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/m/app/hd/index.html?id=10568',
                      'log_code': '31waphomecells_auto_fill001058#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3000194.1\u0026adp=192\u0026adm=13630',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '24',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill',
              'is_show': 'Y',
              'body': {
                'w': 720,
                'h': 440,
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'w': 720,
                    'h': 440,
                    'material_id': 8516,
                    'ad_position_id': 14,
                    'img_url': '//i8.mifile.cn/v1/a1/63215b5f-72c5-82c7-a59b-1b261afd46e7.webp?w=1080\u0026h=660\u0026bg=DBD8E6',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/63215b5f-72c5-82c7-a59b-1b261afd46e7.webp?w=1080\u0026h=660\u0026bg=DBD8E6',
                    'img_url_color': '#DBD8E6',
                    'action': {
                      'type': 'product',
                      'path': '8026',
                      'log_code': '31waphomecells_auto_fill001060#t=ad\u0026act=product\u0026page=home\u0026pid=8026\u0026page_id=26\u0026bid=3000187.1\u0026adp=14\u0026adm=8516',
                    },
                    'path_type': 'image',
                    'category_key': 'home-660h-smart',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'stat': 'three_cross',
              'body': {
                'line_color': '#ffffff',
                'line_height': 6,
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_one_type2',
              'stat': 'three_cross',
              'body': {
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'img_url': '//i8.mifile.cn/b2c-mimall-media/db68b179e4287c321eb2c3685c615088.jpg',
                    'img_percent': 1,
                    'action': {
                      'type': 'product',
                      'path': '7229',
                      'log_code': 'recom_home_58-2#eid=13:0:0:0:0:0:0:0:0:0\u0026page=home\u0026pid=7229',
                      'recommend_code': 'recom_home_58-2#eid=13:0:0:0:0:0:0:0:0:0\u0026page=home\u0026pid=7229',
                    },
                    'product_id': '7229',
                    'product_name': '米家空气净化器 2S',
                    'product_brief': '经典再升级，好空气看得见',
                    'product_price': '899',
                    'product_org_price': '899',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_one_type3',
              'stat': 'three_cross',
              'body': {
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'img_url': '//cdn.cnbj1.fds.api.mi-img.com/mi-mall/bdeb112cc683ea56dead55806cb78a55.jpg',
                    'img_percent': 1,
                    'action': {
                      'type': 'product',
                      'path': '9659',
                      'log_code': 'recom_home_58-3#eid=13:0:0:0:0:0:0:0:0:0\u0026page=home\u0026pid=9659',
                      'recommend_code': 'recom_home_58-3#eid=13:0:0:0:0:0:0:0:0:0\u0026page=home\u0026pid=9659',
                    },
                    'product_id': '9659',
                    'product_name': '米家直流变频落地扇1X',
                    'product_brief': '模拟自然风算法 支持AI语音',
                    'product_price': '299',
                    'product_org_price': '299',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_one_type2',
              'stat': 'three_cross',
              'body': {
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'img_url': '//i8.mifile.cn/b2c-mimall-media/e8121b43506f63797ef6221b4fc7f584.jpg',
                    'img_percent': 1,
                    'action': {
                      'type': 'product',
                      'path': '8026',
                      'log_code': 'recom_home_58-4#eid=13:0:0:0:0:0:0:0:0:0\u0026page=home\u0026pid=8026',
                      'recommend_code': 'recom_home_58-4#eid=13:0:0:0:0:0:0:0:0:0\u0026page=home\u0026pid=8026',
                    },
                    'product_id': '8026',
                    'product_name': '米家智能摄像机云台版',
                    'product_brief': '高清画质，守护家的每一面',
                    'product_price': '189',
                    'product_org_price': '199',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#cecece',
                'line_height': '2',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'list_action_title',
              'block_id': '3456616',
              'body': {
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'action_title': '更多米家智能产品',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/m/app/hd/index.html?id=10288',
                      'log_code': '31waphomelist_action_title001063#t=normal\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3456616.1',
                    },
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '24',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill', 'is_show': 'Y', 'body': {
                'w': 720, 'h': 480, 'height': '0', 'width': '0', 'items': [
                  {
                    'w': 358,
                    'h': 480,
                    'material_id': 41,
                    'ad_position_id': 45,
                    'img_url': '//i8.mifile.cn/v1/a1/46c44f3e-479d-a999-dd2d-98fb39b51e17.webp?w=537\u0026h=720\u0026bg=C0A491',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/46c44f3e-479d-a999-dd2d-98fb39b51e17.webp?w=537\u0026h=720\u0026bg=C0A491',
                    'img_url_color': '#C0A491',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/pages/b180da1593ce9ff93d453eccc44021ad/index.html',
                      'log_code': '31waphomecells_auto_fill001065#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3000196.1\u0026adp=45\u0026adm=41',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'x': 362,
                    'w': 358,
                    'h': 480,
                    'material_id': 46,
                    'ad_position_id': 50,
                    'img_url': '//i8.mifile.cn/v1/a1/b79cb907-3ae4-2a35-6756-b243b386a95a.webp?w=537\u0026h=720\u0026bg=E8CFCB',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/b79cb907-3ae4-2a35-6756-b243b386a95a.webp?w=537\u0026h=720\u0026bg=E8CFCB',
                    'img_url_color': '#E8CFCB',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/m/app/hd/index.html?id=10288',
                      'log_code': '31waphomecells_auto_fill002065#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3000196.2\u0026adp=50\u0026adm=46',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }], 'margin_left': 0, 'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '6',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill', 'is_show': 'Y', 'body': {
                'w': 720, 'h': 480, 'height': '0', 'width': '0', 'items': [
                  {
                    'w': 358,
                    'h': 480,
                    'material_id': 2961,
                    'ad_position_id': 47,
                    'img_url': '//i8.mifile.cn/v1/a1/b883172b-5aa3-7855-678f-c615109ee0a7.webp?w=537\u0026h=720\u0026bg=878F9B',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/b883172b-5aa3-7855-678f-c615109ee0a7.webp?w=537\u0026h=720\u0026bg=878F9B',
                    'img_url_color': '#878F9B',
                    'action': {
                      'type': 'channel',
                      'path': '5594',
                      'log_code': '31waphomecells_auto_fill001067#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3000198.1\u0026adp=47\u0026adm=2961',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'x': 362,
                    'w': 358,
                    'h': 480,
                    'material_id': 44,
                    'ad_position_id': 48,
                    'img_url': '//i8.mifile.cn/v1/a1/8cfcd654-4af5-9ae6-c6cc-1ba9d28be8e8.webp?w=537\u0026h=720\u0026bg=9BB5C4',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/8cfcd654-4af5-9ae6-c6cc-1ba9d28be8e8.webp?w=537\u0026h=720\u0026bg=9BB5C4',
                    'img_url_color': '#9BB5C4',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/pages/ff1d4796fe85a21ba86081db7bf2196b/index.html',
                      'log_code': '31waphomecells_auto_fill002067#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3000198.2\u0026adp=48\u0026adm=44',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }], 'margin_left': 0, 'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '6',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill', 'is_show': 'Y', 'body': {
                'w': 720, 'h': 480, 'height': '0', 'width': '0', 'items': [
                  {
                    'w': 358,
                    'h': 480,
                    'material_id': 10177,
                    'ad_position_id': 49,
                    'img_url': '//i8.mifile.cn/v1/a1/52866372-7fe5-76c2-29a0-9ae32d07b8ff.webp?w=537\u0026h=720\u0026bg=D9D8C3',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/52866372-7fe5-76c2-29a0-9ae32d07b8ff.webp?w=537\u0026h=720\u0026bg=D9D8C3',
                    'img_url_color': '#D9D8C3',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/pages/2ed0828621535a2a85a8f8e3388080d2/index.html',
                      'log_code': '31waphomecells_auto_fill001069#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3000200.1\u0026adp=49\u0026adm=10177',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  },
                  {
                    'x': 362,
                    'w': 358,
                    'h': 480,
                    'material_id': 10178,
                    'ad_position_id': 46,
                    'img_url': '//i8.mifile.cn/v1/a1/ad91499a-59ab-adc3-8fd5-98aefc1c43b4.webp?w=537\u0026h=720\u0026bg=B5C5BE',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/ad91499a-59ab-adc3-8fd5-98aefc1c43b4.webp?w=537\u0026h=720\u0026bg=B5C5BE',
                    'img_url_color': '#B5C5BE',
                    'action': {
                      'type': 'activity',
                      'path': 'https://s1.mi.com/pages/cd6b73b67c77edeaff94e24b961119dd/index.html',
                      'log_code': '31waphomecells_auto_fill002069#t=ad\u0026act=other\u0026page=home\u0026page_id=26\u0026bid=3000200.2\u0026adp=46\u0026adm=10178',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }], 'margin_left': 0, 'margin_right': 0,
              },
            },
            {
              'view_type': 'divider_line',
              'body': {
                'line_color': '#f5f5f5',
                'line_height': '24',
                'height': '0',
                'width': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill',
              'is_show': 'Y',
              'body': {
                'w': 720,
                'h': 280,
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'w': 720,
                    'h': 280,
                    'material_id': 13379,
                    'ad_position_id': 1351,
                    'img_url': '//i8.mifile.cn/v1/a1/fc12f9b1-5f50-642d-d5ca-041bb28bf096.webp?w=1080\u0026h=420\u0026bg=464257',
                    'img_url_webp': '//i8.mifile.cn/v1/a1/fc12f9b1-5f50-642d-d5ca-041bb28bf096.webp?w=1080\u0026h=420\u0026bg=464257',
                    'img_url_color': '#464257',
                    'action': {
                      'type': 'url',
                      'path': 'https://s1.mi.com/m/ghd/2019/gxc0624/index.html',
                      'log_code': '31waphomecells_auto_fill001071#t=ad\u0026act=webview\u0026page=home\u0026page_id=26\u0026bid=3038946.1\u0026adp=1351\u0026adm=13379',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'margin_left': 0,
                'margin_right': 0,
              },
            },
            {
              'view_type': 'cells_auto_fill',
              'block_id': '3265907',
              'body': {
                'bg_color': '#ffffff',
                'w': 720,
                'h': 72,
                'height': '0',
                'width': '0',
                'items': [
                  {
                    'w': 720,
                    'h': 106,
                    'img_url': '//cdn.cnbj0.fds.api.mi-img.com/b2c-mimall-media/bbb5bac8089d890338b5bf8ff742cbbc.png',
                    'img_url_webp': '//cdn.cnbj0.fds.api.mi-img.com/b2c-mimall-media/bbb5bac8089d890338b5bf8ff742cbbc.png',
                    'img_url_color': '#FFFFFF',
                    'action': {
                      'type': 'url',
                      'path': 'https://cdn.cnbj0.fds.api.mi-img.com/b2c-data-mishop/63ba4b56717e.html',
                      'log_code': '31waphomecells_auto_fill001072#t=normal\u0026act=webview\u0026page=home\u0026page_id=26\u0026bid=3265907.1',
                    },
                    'path_type': 'image',
                    'margin_left': 0,
                    'margin_right': 0,
                  }],
                'recommend_flag': '0',
                'margin_left': 0,
                'margin_right': 0,
              },
            }],
          'seo': {
            'title': '小米商城-小米官方网站，小米手机、红米手机正品专卖',
            'keywords': '小米,小米官网,小米手机,小米官网首页,小米商城',
            'description': '小米商城直营小米公司旗下所有产品，囊括小米手机、红米手机、智能硬件及小米生活周边，同时提供小米客户服务及售后支持。',
          },
        }, 'default_type': 'home', 'default_id': 0,
      },
    };
  }

}

module.exports = SiteController;
