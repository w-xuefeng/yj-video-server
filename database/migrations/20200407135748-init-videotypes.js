'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 videotype 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('videotypes', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      typename: STRING(255),
      created_time: DATE,
    });
  },
  // 在执行数据库降级时调用的函数，删除 videotype 表
  down: async queryInterface => {
    await queryInterface.dropTable('videotypes');
  },
};
