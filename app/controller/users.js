'use strict';
const md5 = require('md5-node');
const { SuccessRes, ErrorRes } = require('../utils/response');
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
      attributes: [ 'id', 'username', 'created_time', 'collection' ],
    };
    const result = await ctx.model.User.findAll(query);
    ctx.body = SuccessRes(result);
  }

  async show() {
    const ctx = this.ctx;
    const user = await ctx.model.User.findByPk(toInt(ctx.params.id), {
      attributes: [ 'id', 'username', 'created_time', 'collection' ],
    });
    ctx.body = user ? SuccessRes(user) : ErrorRes('用户不存在');
  }

  async create() {
    const ctx = this.ctx;
    let { username = '', password = '' } = ctx.request.body;
    username = username.trim();
    password = password.trim();
    if (!username) {
      ctx.status = 200;
      ctx.body = ErrorRes('用户名不能为空');
      return;
    }
    if (!password) {
      ctx.status = 200;
      ctx.body = ErrorRes('密码不能为空');
      return;
    }
    const ifuser = await ctx.model.User.findOne({
      where: { username },
    });
    if (ifuser) {
      ctx.status = 200;
      ctx.body = ErrorRes('用户已注册');
      return;
    }

    const user = await ctx.model.User.create({
      username,
      password: md5(md5(password)),
      created_time: Date.now(),
      collection: [],
    });
    ctx.status = 201;
    ctx.body = SuccessRes(user);
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.status = 404;
      ctx.body = ErrorRes('用户不存在');
      return;
    }

    const { password } = ctx.request.body;
    await user.update({ password: md5(md5(password)) });
    ctx.body = SuccessRes({
      message: '修改成功',
    });
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.status = 404; // 未找到
      ctx.body = ErrorRes('用户不存在');
      return;
    }

    await user.destroy();
    ctx.status = 200;
    ctx.body = SuccessRes({
      message: '删除成功',
    });
  }
}

module.exports = UserController;
