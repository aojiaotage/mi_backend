'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/api/v1/order', controller.order.listOrders);
  router.get('/api/v1/order/:id', controller.order.getOrderById);
  router.patch('/api/v1/order/:id', controller.order.updateOrderById);
  router.post('/api/v1/order', controller.order.createNewOrder);

};
