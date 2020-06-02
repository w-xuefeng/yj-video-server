'use strict';

const Controller = require('egg').Controller;
const { SuccessRes, ErrorRes } = require('../utils/response');
const { myEncode } = require('../utils/encode');
const md5 = require('md5-node');

class SessionController extends Controller {
  async login() {
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
    if (!ifuser) {
      // ctx.status = 400;
      ctx.body = ErrorRes('用户不存在');
      return;
    }

    if (md5(md5(password)) === ifuser.password) {
      const { id, username, created_time, collection } = ifuser;
      const strings = `${id}-${username}`;
      const token = myEncode(strings, this.app.config.tokenPrivate);
      // 生成 token
      const islogin = await ctx.model.Loginsession.findOne({ where: { userid: id } });
      // 查询 session 表中用户是否登陆过
      if (islogin) {
        await islogin.update({ token });
        // 更新登录 token
      } else {
        await ctx.model.Loginsession.create({ userid: id, token });
        // 创建登录 token
      }
      ctx.rotateCsrfSecret();
      // 刷新 x-csrf-token
      ctx.status = 200;
      ctx.body = SuccessRes({ id, username, collection, created_time, token });
    } else {
      // ctx.status = 400;
      ctx.body = ErrorRes('密码错误');
    }
  }
  async loginAdmin() {
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
    if (!ifuser) {
      // ctx.status = 400;
      ctx.body = ErrorRes('用户不存在');
      return;
    }

    if (md5(md5(password)) === ifuser.password) {
      const { id, username, created_time, usertype } = ifuser;
      const strings = `${id}-${username}`;
      const token = myEncode(strings, this.app.config.tokenPrivate);
      // 生成 token
      const islogin = await ctx.model.Loginsession.findOne({ where: { userid: id } });
      // 查询 session 表中用户是否登陆过
      if (islogin) {
        await islogin.update({ token });
        // 更新登录 token
      } else {
        await ctx.model.Loginsession.create({ userid: id, token });
        // 创建登录 token
      }
      if (ifuser.usertype !== 1) {
        ctx.body = ErrorRes('非管理员用户无法登录');
        return;
      }
      ctx.rotateCsrfSecret();
      // 刷新 x-csrf-token
      ctx.status = 200;
      ctx.body = SuccessRes({ id, username, created_time, token, usertype });
    } else {
      // ctx.status = 400;
      ctx.body = ErrorRes('密码错误');
    }
  }
}

module.exports = SessionController;
