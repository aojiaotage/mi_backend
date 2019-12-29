'use strict';

const moment = require('moment');

const { Controller } = require('egg');

class OrderController extends Controller {

  async orderCheckOut() {

    const userId = this.ctx.session.user.id;

    const cartItems = await this.ctx.service.cart.listItems(
      { user_id: userId });

    const address = (await this.ctx.service.address.listAddresses(
      { user_ids: [userId], limit: 1 }))[0].toJSON();

    address.address_id = address.id;

    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        cartlist: {
          items: cartItems.map(i => {
            return {
              goodsId: i.goods_id,
              image_url: i.img_url,
              num: i.nums,
              short_name: i.name,
              subtotal: i.price * i.nums,
            };
          }),
        },
        address,
        paymethod: [
          {
            checked: '1',
            subtitle: '支付订单',
            type: 'weixin_wap',
            value: '微信支付',
          },
        ],
      },
    };
  }

  async createNewOrder() {
    const { products, addressId, bestShipTime } = this.ctx.request.body;

    let goods = await this.ctx.service.goods.listGoods(
      { ids: products.map(p => p.id) });

    goods = goods.map(g => {
      const p = products.find(e => e.id.toString() === g.id.toString());
      const gObj = g.toJSON();
      // gObj.coupons = p.coupons;
      gObj.nums = p.nums;
      gObj.reduce_price = 0;
      gObj.sub_total = (g.nums * (g.price || 0) - gObj.reduce_price) || 999999;
      return gObj;
    });

    const { address } = await this.ctx.service.address.getAddressDetail(
      addressId);
    // TODO 发票信息
    // const { invoice } = await this.ctx.service.invoice.getInvoiceDetail(invoiceId);

    // TODO 配送价格
    // const expense = await this.ctx.service.shipping.getShippingExpense(invoiceId);

    // TODO 检查库存
    // this.ctx.service.inventory.checkInventory(goods);

    const created = await this.ctx.service.order.createNewOrder({
      user_id: this.ctx.session.user.id,
      goods,
      address,
      best_time: bestShipTime,
    });

    const prePayInfo = await this.ctx.service.order.createWXOrder();

    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        order: created,
        prePayInfo,
      },
    };
  }

  async wxOrderCallback() {
    await this.ctx.service.order.updateOrderStatusFromWX();
  }

  async listOrders() {
    const { query } = this.ctx.request;
    const orders = await this.ctx.service.order.listOrders(query);

    const list = orders.map(o => {
      return {
        order_id: o.id,
        order_status: o.status,
        goods_amount: o.goods_amount,
        add_time: moment(o.created_at).format('YYYY/MM/DD  HH:mm:SS'),
        order_status_info: '等待付款',
        product: o.subOrders.map(s => {
          return {
            goods_id: s.goods_id,
            image_url: '//i1.mifile.cn/a1/pms_1527060327.66235934!180x1800.jpg,//i1.mifile.cn/a1/pms_1527735134.03584233!180x1800.jpg,//i1.mifile.cn/a1/pms_1501236937.96732594!180x1800.jpg',
            product_name: s.name,
            product_count: s.nums,
          };
        }),
      };
    });

    this.ctx.body = {
      code: 0,
      status: 200,
      data: {
        list,
      },
    };
  }

  async getOrderById() {
    const { id } = this.ctx.params;
    const query = {
      ids: [id],
    };
    const [o] = await this.ctx.service.order.listOrders(query);
    const obj = {
      order_id: o.id,
      order_status: o.status,
      goods_amount: o.goods_amount,
      add_time: moment(o.created_at).format('YYYY/MM/DD  HH:mm:SS'),
      order_status_info: '等待付款',
      product: o.subOrders.map(s => {
        return {
          goods_id: s.goods_id,
          image_url: '//i1.mifile.cn/a1/pms_1527060327.66235934!180x1800.jpg,//i1.mifile.cn/a1/pms_1527735134.03584233!180x1800.jpg,//i1.mifile.cn/a1/pms_1501236937.96732594!180x1800.jpg',
          product_name: s.name,
          product_count: s.nums,
        };
      }),
    };
    this.ctx.body = {
      code: 0,
      status: 200,
      data: obj,
    };
  }

  async updateOrderById() {
    const { id } = this.ctx.params;
    const { order } = this.ctx.request.body;
    order.id = id;
    await this.ctx.service.order.updateOrder(order);
    this.ctx.body = {
      code: 0,
      status: 200,
    };
  }

}

module.exports = OrderController;

