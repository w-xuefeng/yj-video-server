'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 comments 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, TEXT } = Sequelize;
    await queryInterface.createTable('comments', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      videoid: INTEGER,
      userid: INTEGER,
      content: TEXT,
      created_time: DATE,
    });
  },
  // 在执行数据库降级时调用的函数，删除 comments 表
  down: async queryInterface => {
    await queryInterface.dropTable('comments');
  },
};
