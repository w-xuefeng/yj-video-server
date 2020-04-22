/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  // ORM mysql2
  const config = exports = {
    sequelize: {
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'vod',
      timezone: '+08:00', // 保存为本地时区,
      dialectOptions: {
        dateStrings: true,
        typeCast(field, next) {
          // for reading from database
          if (field.type === 'DATETIME') {
            return field.string();
          }
          return next();
        },
      },
    },
    security: {
      csrf: {
        headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
      },
    },
  };
  config.assets = {
    publicPath: '/public/',
  };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1586242297261_2642';

  // add your middleware config here
  config.middleware = [
    'handleToken',
  ];

  config.handleToken = {
    tokenKey: 'authorization',
    baseContent: 'Bearer',
    keeptime: 2 * 24 * 60 * 60 * 1000,
    whiteList: [
      '/',
      '/login',
      '/login/admin',
      '/videotypes',
      '/banners',
      '/public',
      {
        url: '/videos',
        method: 'GET',
      },
      {
        url: '/users',
        method: 'POST',
      },
    ],
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    tokenPrivate: 'yangjin',
  };

  return {
    ...config,
    ...userConfig,
  };
};
