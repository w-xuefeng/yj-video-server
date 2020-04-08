'use strict';

const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class CommentController extends Controller {

  async findCommentsByVideoId() {
    const ctx = this.ctx;
    const query = {
      limit: toInt(ctx.query.limit),
      offset: toInt(ctx.query.offset),
      where: {
        videoid: toInt(ctx.query.id),
      }
    };
    const result = await ctx.model.Comment.findAll(query);
    ctx.body = result
  }


  async findCommentsByUserId() {
    const ctx = this.ctx;
    const query = {
      limit: toInt(ctx.query.limit),
      offset: toInt(ctx.query.offset),
      where: {
        userid: toInt(ctx.query.id),
      }
    };
    const result = await ctx.model.Comment.findAll(query);
    ctx.body = result
  }

  async create() {
    const ctx = this.ctx;
    const { content, videoid, userid } = ctx.request.body;
    const comment = await ctx.model.Comment.create({
      content,
      videoid,
      userid,
      created_time: Date.now(),
    });
    ctx.status = 201;
    ctx.body = comment;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const comment = await ctx.model.Comment.findByPk(id);
    if (!comment) {
      ctx.status = 404; // 未找到
      return;
    }
    await comment.destroy();
    ctx.status = 200;
  }
}

module.exports = CommentController;
