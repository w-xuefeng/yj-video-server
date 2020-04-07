'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 banners 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('banners', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      title: STRING(255),
      imgurl: STRING(255),
      created_time: DATE,
      videoid: INTEGER
    });
  },
  // 在执行数据库降级时调用的函数，删除 banners 表
  down: async queryInterface => {
    await queryInterface.dropTable('banners');
  },
};
