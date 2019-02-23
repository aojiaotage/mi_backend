'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = '9fd8a7gdf88127363nmmkkerhh';

  // add your config here
  config.middleware = [];

  config.sequelize = {
    dialect: 'postgres',
    host: 'localhost',
    database: 'mi_main',
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
