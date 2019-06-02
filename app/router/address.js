'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/api/v1/address', controller.address.listAddresses);
  router.get('/api/v1/address/:id', controller.address.getAddressById);
  router.patch('/api/v1/address/:id', controller.address.updateAddressById);
  router.post('/api/v1/address', controller.address.createNewAddress);
  router.delete('/api/v1/address/:id', controller.address.deleteAddressById);

};
