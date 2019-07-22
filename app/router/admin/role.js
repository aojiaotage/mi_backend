'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.post('/api/v1/admin/role', controller.adminRole.createNewRole);
  router.get('/api/v1/admin/role', controller.adminRole.listRoles);
  router.get('/api/v1/admin/role/:id', controller.adminRole.getRoleById);
  router.patch('/api/v1/admin/role/:id', controller.adminRole.updateRoleById);

};
