'use strict';
const Controller = require('egg').Controller;
const { SuccessRes, ErrorRes } = require('../utils/response');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

// 传参方式 GET
/**
 * 1.query
 * https://yj.com:7001/path/content?a=10&b=yangjin
 * https://yj.com:7001/users
 * https://yj.com:7001/users?id=20161234
 *
 * const { a, b } = this.ctx.query
 *
 * a = 10
 * b = yangjin
 *
 */

/**
  * 2.params (pathinfo)
  * /path/content/:a/:b
  * https://yj.com:7001/path/content/10/yangjin
  *
  * https://yj.com:7001/users
  * https://yj.com:7001/users/:id
  * https://yj.com:7001/users/20161234
  *
  * const { a, b } = this.ctx.params
  * a = 10
  * b = yangjin
  */

/**
 * POST PATCH PUT DELETE
 * body {}
 * const { username, passsword } = this.ctx.request.body
 */
class BannerController extends Controller {
  async index() {
    const ctx = this.ctx;
    const result = await ctx.model.Banner.findAll({ timestepe: false });
    ctx.body = result.length === 0 ? ErrorRes('暂无数据') : SuccessRes(result); // 将查询到的结果赋值给 响应的主体
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = SuccessRes(await ctx.model.Banner.findByPk(toInt(ctx.params.id)));
  }

  async create() {
    const ctx = this.ctx;
    const { title, videoid, imgurl } = ctx.request.body;
    const banner = await ctx.model.Banner.create({
      title,
      videoid,
      imgurl,
      created_time: Date.now(),
    });
    ctx.status = 201; // 表示已创建
    ctx.body = SuccessRes(banner); // 响应前端body
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const banner = await ctx.model.Banner.findByPk(id);
    if (!banner) {
      // ctx.status = 404; // 未找到
      ctx.body = ErrorRes('banner不存在');
      return;
    }
    const { title, videoid, imgurl } = ctx.request.body;
    await banner.update({ title, videoid, imgurl });
    ctx.body = SuccessRes({
      message: '修改成功',
    });
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const banner = await ctx.model.Banner.findByPk(id);
    if (!banner) {
      // ctx.status = 404;
      ctx.body = ErrorRes('banner不存在');
      return;
    }
    await banner.destroy();
    ctx.status = 200; // "ok"
    ctx.body = SuccessRes({
      message: '删除成功',
    });
  }
}

module.exports = BannerController;
