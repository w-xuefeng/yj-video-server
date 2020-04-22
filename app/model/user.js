'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: STRING(30),
    password: STRING(50),
    created_time: DATE,
    collection: app.Sequelize.JSON,
    usertype: INTEGER,
  }, { timestamps: false });

  return User;
};
