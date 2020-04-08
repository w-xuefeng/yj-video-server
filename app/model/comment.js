'use strict';

module.exports = app => {
  const { TEXT, INTEGER, DATE } = app.Sequelize;

  const Comment = app.model.define('comment', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    videoid: INTEGER,
    userid: INTEGER,
    content: TEXT,
    created_time: DATE,
  }, { timestamps: false });

  return Comment;
};
