'use strict';

// TODO this is mock role id
const ROLE_IDS = ['92fdcaf6-7590-4667-a54b-6d0ef1befed5'];

module.exports = (opts) => {
  return async (ctx, next) => {

    if (!ctx.session.user) {
      throw new ctx.app.error.NoAuth();
    }

    // see if user has permissions

    const { user } = ctx.session;

    if (!user.permissions) {

      // query user role
      // query user permission
      // access or no access

      const roles = await ctx.service.role.listRoles({ ids: ROLE_IDS });
      const permissions = await ctx.service.permission.listPermissions(
        { role_ids: roles.map(r => r.id) });

      user.permissons = permissions.map(p => p.toJSON());

    }

    const { path, method } = ctx.request;

    const allowed = user.permissons.find(
      p => (path.match(p.path)) && (p.method.toUpperCase() === method) && (p.allow === true));

    if (!allowed) {
      throw new ctx.app.error.NoAuth();
    }

    await next();
  };
};
