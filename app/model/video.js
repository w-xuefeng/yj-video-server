'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Video = app.model.define('video', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    videoname: STRING(100),
    videosize: STRING(50),
    videotime: STRING(50),
    videotypeid: INTEGER,
    videourl: STRING(255),
    videocover: STRING(255),
    created_time: DATE,
  }, { timestamps: false });

  return Video;
};
