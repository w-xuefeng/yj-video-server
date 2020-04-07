'use strict';
const md5 = require('md5-node');
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class UserController extends Controller {
  async index() {
    const ctx = this.ctx;
    const query = {
      limit: toInt(ctx.query.limit),
      offset: toInt(ctx.query.offset),
      attributes: ['id', 'username', 'created_time', 'collection']
    };
    const result = await ctx.model.User.findAll(query);
    ctx.body = result
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.User.findByPk(toInt(ctx.params.id), {
      attributes: ['id', 'username', 'created_time', 'collection']
    });
  }

  async create() {
    const ctx = this.ctx;
    const { username, password } = ctx.request.body;
    const user = await ctx.model.User.create({
      username,
      password: md5(md5(password)),
      created_time: Date.now(),
      collection: []
    });
    ctx.status = 201;
    ctx.body = user;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.status = 404;
      return;
    }

    const { password } = ctx.request.body;
    await user.update({ password: md5(md5(password)) });
    ctx.body = user;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.status = 404;
      return;
    }

    await user.destroy();
    ctx.status = 200;
  }
}

module.exports = UserController;
