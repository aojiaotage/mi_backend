'use strict';

module.exports = (opts) => {
  return async (ctx, next) => {
    if (!ctx.session.user) {
      throw new ctx.app.error.NoAuth();
    }

    await next();
  };
};
