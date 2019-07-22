'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.post('/api/v1/admin/permission', controller.adminPermission.createNewPermission);
  router.get('/api/v1/admin/permission', controller.adminPermission.listPermissions);
  router.get('/api/v1/admin/permission/:id', controller.adminPermission.getPermissionById);
  router.patch('/api/v1/admin/permission/:id', controller.adminPermission.updatePermissionById);

};
