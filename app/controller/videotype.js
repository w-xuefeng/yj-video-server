'use strict';
const Controller = require('egg').Controller;

const { SuccessRes, ErrorRes } = require('../utils/response');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class VideoTypeController extends Controller {
  async index() {
    const ctx = this.ctx;
    const result = await ctx.model.Videotype.findAll();
    ctx.body = result.length === 0 ? SuccessRes(result) : ErrorRes("暂无数据");
  }

  async create() {
    const ctx = this.ctx;
    const { typename } = ctx.request.body;
    const videotype = await ctx.model.Videotype.create({
      typename,
      created_time: Date.now(),
    });
    ctx.status = 201; //表示已创建
    ctx.body = videotype; //响应前端body  ????
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const videotype = await ctx.model.Videotype.findByPk(id);
    if (!videotype) {
      ctx.status = 404; //未找到
      return;
    }

    const { typename } = ctx.request.body;
    await videotype.update({ typename });
    ctx.body = videotype;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const videotype = await ctx.model.Videotype.findByPk(id);
    if (!videotype) {
      ctx.status = 404;
      return;
    }

    await videotype.destroy();
    ctx.status = 200;  // "ok"
  }
}

module.exports = VideoTypeController;
