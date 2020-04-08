'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Videotype = app.model.define('videotype', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    typename: STRING(255),
    created_time: DATE,
  }, { timestamps: false });

  return Videotype;
};
