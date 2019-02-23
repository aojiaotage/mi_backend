'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  /**
   * @apiVersion 0.1.0
   * @api {POST} /user 创建用户
   * @apiGroup site
   *
   * @apiParam {String} username 用户名
   * @apiParam {String} password 密码
   *
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {Object} data.user 用户对象
   * @apiSuccess {String} data.user.id 用户id，UUIDv4版本
   *
   * @apiSuccessExample Success-Response:
   *{"code":0,"data":{"user":{"id":"512914f0-84ad-40e2-a7af-3604d828d491","username":"11117",
   * "updated_at":"2019-01-30T12:56:58.273Z","created_at":"2019-01-30T12:56:58.273Z","phoneNumber":null}}}
   *
   */
  router.post('/user', controller.site.createUser);
  router.get('/user', controller.site.getUser);
  router.post('/login', controller.site.loginWithUnPw);
  router.get('/', controller.site.index);
  router.post('/logout', controller.site.logout);
  // router.post('/sendVerifyCode', controller.site.sendVerifyCode);

  router.post('/api/v1/admin/product', controller.adminProduct.createNewProduct);

  console.log(controller);

  router.get('/api/v1/admin/product', controller.adminProduct.listProducts);

  // B端API 通用前缀： /api/v1/admin/
  // 商品
  /**
   * @apiVersion 0.1.0
   * @api {GET} /product/:product_id 商品管理-详情
   * @apiGroup ADMIN/PRODUCT
   *
   * @apiParam {String} product_id 商品id
   *
   * @apiSuccess {String} default_goods_id 默认goods_id
   * @apiSuccess {Object} product_info 产品信息
   * @apiSuccess {Boolean} product_info.is_batched 是否打包销售？
   * @apiSuccess {Boolean} product_info.is_enable 是否上架？
   * @apiSuccess {String} product_info.name 商品名称
   * @apiSuccess {Object} product_info.price_tips 建议价格？
   * @apiSuccess {String} product_info.product_desc 商品简述
   * @apiSuccess {String} product_info.product_id 商品id
   * @apiSuccess {String} product_info.product_gallery_icon 相册图片
   * @apiSuccess {String} product_info.share_content 分享内容
   * @apiSuccess {Array} product_info.goods_ids goods_id数组
   *
   * @apiSuccessExample Success-Response:
   {
  "code": 0,
    "result": "ok",
    "description": "success",
    "data": {
    "default_goods_id": "2181500027",
      "product_info": {
      "activity_tips": {
        "action": {},
        "img_url": ""
      },
      "is_batched": false,
        "is_enable": true,
        "name": "小米6X",
        "price_tips": {},
      "product_desc": "<font color='#ff4a00'>「4GB+64GB赠价值59元蓝牙耳机」</font>前置2000万“治愈系”自拍 / 后置2000万 AI双摄 / “杨柳腰”纤薄机身 / 标配骁龙660 AIE处理器",
        "product_gallery_icon": {},
      "product_id": 10000091,
        "share_content": ""
    },
  }
}
   *
   */

};
