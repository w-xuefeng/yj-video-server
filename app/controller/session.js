'use strict';

const Controller = require('egg').Controller;
const { SuccessRes, ErrorRes } = require('../utils/response');
const { myEncode } = require('../utils/encode');
const md5 = require('md5-node');

class SessionController extends Controller {
  async login() {
    const ctx = this.ctx;
    let { username = '', password = '' } = ctx.request.body;
    username = username.trim()
    password = password.trim()
    if (!username) {
      ctx.status = 200;
      ctx.body = ErrorRes('用户名不能为空');
      return
    }
    if (!password) {
      ctx.status = 200;
      ctx.body = ErrorRes('密码不能为空');
      return
    }
    const ifuser = await ctx.model.User.findOne({
      where: { username }
    });
    if (!ifuser) {
      ctx.status = 400;
      ctx.body = ErrorRes('用户不存在');
      return;
    }

    if (md5(md5(password)) === ifuser.password) {
      const strings = `${ifuser.id}-${ifuser.username}-${ifuser.password}`
      const { id, username, created_time } = ifuser
      ctx.status = 200;
      ctx.body = SuccessRes({
        id, username, created_time, token: myEncode(strings, this.app.config.tokenPrivate)
      });
    } else {
      ctx.status = 400;
      ctx.body = ErrorRes('密码错误');
    }
  }
}

module.exports = SessionController;
