'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/api/v1/cart', controller.cart.listItems);
  router.patch('/api/v1/cart', controller.cart.updateCart);
  router.patch('/api/v1/cart/item/:itemId', controller.cart.editItemById);
  router.post('/api/v1/cart/item', controller.cart.createNewItem);
  router.delete('/api/v1/cart/item/:id', controller.cart.deleteItemById);
  router.post('/api/v1/cart/item/:id/service', controller.cart.createNewService);
};
