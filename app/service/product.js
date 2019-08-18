'use strict';

const { Service } = require('egg');

class Product extends Service {
  async createNewProduct(product) {
    const created = await this.app.model.Product.createNewProduct(product);
    return created;
  }

  async listProducts(query) {
    const products = await this.app.model.Product.listProducts(query);
    return products;
  }

  async updateProduct(product) {
    const updatedRows = await this.app.model.Product.updateProduct(product);
    return updatedRows;
  }

  async getProductDetail(id) {
    let [product] = await this.listProducts({ ids: [id] });
    product = product.toJSON();

    const ps = [
      this.ctx.service.goods.listGoods({ product_id: id }),
    ];

    let [goodsList] = await Promise.all(
      ps);

    goodsList = goodsList.map(g => g.toJSON());

    await this.ctx.service.inventory.fillGoodsRealInventory(goodsList);

    await this.ctx.service.goods.fillGoodsInfoForSale(goodsList);

    product.buy_option = goodsList.map(g => {
      return {
        list: [
          {
            is_stock: g.inventory > 0,
            name: g.name,
            price: g.price,
          }],
        name: '版本',
        prop_cfg_id: 185,
      };
    });

    const view_content = {
      commentView: {
        commentView: {
          detail: {
            comment_labels: null,
            comments_bad: 7,
            comments_general: 363,
            comments_good: 9977,
            comments_total: 10347,
            five_star: 9281,
            four_star: 696,
            one_star: 7,
            satisfy_per: '96.4',
            three_star: 218,
            two_star: 145,
          },
          list: [
            {
              add_time: '2018-06-14',
              average_grade: 5,
              comment_content: '老婆说我可能疯了！疯狂的购买小米的一切产品！我说，你不懂！小米是一种情怀，一个让国人感动的品牌！小米没有上市以前，我还在用着高价的低档手机！国外产品，赚中国人民的钱，笑民众傻！是小米让我看到了国产品牌的明天！我并没有偶像，自从知道雷总之后！才让我找到了偶像！顺便求个客服妹子！',
              comment_full_images: [],
              comment_grade: 1,
              comment_id: '156205649',
              comment_images: [],
              comment_title: '',
              down: false,
              down_num: 0,
              has_up_customer: false,
              is_top: '1',
              reply_content: '独乐乐不如众乐乐，好东西您分享给她她才知道嘛~~所以赶紧小米8了解一下？感谢您对小米的支持。',
              reply_time: '2018-06-15',
              site_id: '101',
              site_name: '小米移动商城',
              up: false,
              up_customer_num: 123,
              up_num: 98,
              up_rate: 100,
              user_avatar: '//cdn.cnbj0.fds.api.mi-img.com/b2c-data-mishop/c52c11c915d43e0ac3286161eec4fcaf.jpg',
              user_id: '846***320',
              user_name: '刘文旭',
              user_reply_num: 0,
              user_replys: [],
            },
          ],
          total: 10349,
        },
        viewType: 'commentView',
      },
      descTabsView: {
        descTabsView: [
          {
            name: '概述',
            tabContent: [
              {
                plainView: {
                  content: '',
                  img: '//cdn.cnbj0.fds.api.mi-img.com/b2c-mimall-media/e996427a3e66b49399abcd4d0f03387b.jpg?w=1080&h=1920',
                  is_not_compress: '0',
                  title: '',
                },
                viewType: 'plainView',
              },
            ],
          },
        ],
        viewType: 'descTabsView',
      },
      galleryView: {
        galleryView: [],
        viewType: 'galleryView',
      },
      relatePackageView: {
        relatePackageView: {
          packages: [],
          title: '精选套餐',
        },
        viewType: 'relatePackageView',
      },
      relatePartsView: {
        relatePartsView: {
          desc: '',
          parts: [],
          title: '配件',
        },
        viewType: 'relatePartsView',
      },
      titleView: {
        titleView: {
          adapt: [],
          brief: '',
          canJoinActs: [
            {
              title: '赠小米蓝牙耳机',
              type: 'gift',
              type_desc: '赠品',
            },
          ],
          market_price: '1599',
          name: '小米6X',
          price: '1599',
          product_desc: '<font color=\'#ff4a00\'>「4GB+64GB赠价值59元蓝牙耳机」</font>前置2000万“治愈系”自拍 / 后置2000万 AI双摄 / “杨柳腰”纤薄机身 / 标配骁龙660 AIE处理器',
          share_content: '',
        },
        viewType: 'titleView',
      },
    };

    return {
      product,
      goodsList,
      view_content,
    };
  }
}

module.exports = Product;
