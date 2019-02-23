'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1535158045837_8817';

  // add your config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.sequelize = {
    dialect: 'postgres',
    host: 'localhost',
    database: 'mi_local_test',
    port: 5432,
    username: 'lurenlaoyang',
    password: '',
    pool: {
      max: 10,
      min: 1,
    },
  };

  config.onerror = {
    json(err, ctx) {
      const { code, httpStatusCode, httpMsg } = err;
      if (httpStatusCode) ctx.statusCode = httpStatusCode;
      ctx.body = {
        code,
        msg: httpMsg,
      };
    },
  };

  return config;
};
