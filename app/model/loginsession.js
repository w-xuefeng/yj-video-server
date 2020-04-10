'use strict';

module.exports = app => {
  const { TEXT, INTEGER, DATE } = app.Sequelize;

  const Loginsession = app.model.define('Loginsession', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    userid: INTEGER,
    token: TEXT,
    created_at: DATE,
    updated_at: DATE,
  });

  return Loginsession;
};
