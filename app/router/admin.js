'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

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
  router.post('/api/v1/admin/product', controller.adminProduct.createNewProduct);
  router.get('/api/v1/admin/product', controller.adminProduct.listProducts);
  router.get('/api/v1/admin/product/:id', controller.adminProduct.getProduct);
  router.patch('/api/v1/admin/product/:id', controller.adminProduct.updateProduct);

  router.post('/api/v1/admin/goods', controller.adminGoods.createNewGoods);
  router.get('/api/v1/admin/goods', controller.adminGoods.listGoods);
  router.get('/api/v1/admin/goods/:id', controller.adminGoods.getGoods);
  router.patch('/api/v1/admin/goods/:id', controller.adminGoods.updateGoods);

  // B端API 通用前缀： /api/v1/admin/
  // 商品


};
