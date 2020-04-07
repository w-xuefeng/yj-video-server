'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Banner = app.model.define('banner', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    title: STRING(255),
    imgurl: STRING(255),
    created_time: DATE,
    videoid: INTEGER
  });

  return Banner;
};
