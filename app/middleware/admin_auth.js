'use strict';

module.exports = (opts) => {
  return async (ctx, next) => {



    // throw new Error('you need to login first');

    await next();
  };
};
