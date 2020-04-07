'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 videos 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('videos', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      videoname: STRING(100),
      videosize: STRING(50),
      videotime: STRING(50),
      videotype: INTEGER,
      videourl: STRING(255),
      videocover: STRING(255),
      created_time: DATE,
    });
  },
  // 在执行数据库降级时调用的函数，删除 videos 表
  down: async queryInterface => {
    await queryInterface.dropTable('videos');
  },
};
