'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/api/v1/user/', controller.user.getUser);
  router.post('/api/v1/user/logout', controller.user.logout);

};
