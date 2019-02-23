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
    domainWhiteList: [ 'http://localhost:8080' ],
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

  config.redis = {
    client: {
      host: 'localhost',
      port: 6379,
      db: 0,
      password: '',
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
