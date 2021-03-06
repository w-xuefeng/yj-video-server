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
      password: '',
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
    multipart: {
      fields: 50, // 设置文件上传字段 50个
      fileSize: 1024 ** 3, // 设置文件上传大小 1GB
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
      '/feedback',
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
    uploadPath: {
      bannerPath: 'public/uploads/img/banner/',
      videoCoverPath: 'public/uploads/img/video-cover/',
      videoPath: 'public/uploads/videos/',
    },
    email: {
      host: '', // 反馈邮件的发件人邮箱 【你可以写自己的QQ邮箱，或者其他的邮箱】
      name: '猿学网', // 反馈邮件的发件人名称
      pass: '', // 反馈邮件的发件人邮箱 授权码（不是密码） 【需要你填写授权码】
      feedback: '', // 反馈邮件的收件人邮箱
    },
  };

  // 此文件如果要提交的话, 一定要先把 email 下的敏感信息删除后再提交

  return {
    ...config,
    ...userConfig,
  };
};
