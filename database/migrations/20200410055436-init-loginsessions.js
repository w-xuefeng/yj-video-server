'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 loginsessions 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, TEXT } = Sequelize;
    await queryInterface.createTable('loginsessions', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      userid: INTEGER,
      token: TEXT,
      created_at: DATE,
      updated_at: DATE,
    });
  },
  // 在执行数据库降级时调用的函数，删除 loginsessions 表
  down: async queryInterface => {
    await queryInterface.dropTable('loginsessions');
  },
};
