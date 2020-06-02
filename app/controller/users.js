'use strict';
const md5 = require('md5-node');
const { SuccessRes, ErrorRes, toObj, toInt } = require('../utils/response');
const Controller = require('egg').Controller;

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

  async getUsers() {
    const ctx = this.ctx;
    const query = {
      limit: toInt(ctx.query.limit),
      offset: toInt(ctx.query.offset),
      attributes: [ 'id', 'username', 'created_time', 'collection' ],
    };
    const { count, rows } = await ctx.model.User.findAndCountAll(query);
    ctx.body = count === 0 ? ErrorRes('暂无数据') : { ...SuccessRes(rows), count };
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

  async getCollection() {
    const ctx = this.ctx;
    const uid = toInt(ctx.params.uid);
    const user = await ctx.model.User.findByPk(uid);
    if (!user) {
      // ctx.status = 404;
      ctx.body = ErrorRes('用户不存在');
      return;
    }

    const { collection } = toObj(user);
    ctx.model.Video.belongsTo(ctx.model.Videotypes, { foreignKey: 'videotypeid', targetKey: 'id' });
    const query = id => ({
      where: { id: toInt(id) },
      include: [
        {
          model: ctx.model.Videotypes,
          required: true,
        },
      ],
    });
    const req = collection.map(e => ctx.model.Video.findOne(query(e)));
    const res = await Promise.all(req);
    ctx.body = SuccessRes(res);
  }

  async addCollection() {
    const ctx = this.ctx;
    let { uid, vid } = ctx.request.body;
    uid = toInt(uid);
    vid = toInt(vid);
    const user = await ctx.model.User.findByPk(uid);
    if (!user) {
      // ctx.status = 404;
      ctx.body = ErrorRes('用户不存在');
      return;
    }

    const userObj = toObj(user);
    if (userObj.collection.includes(vid)) {
      ctx.body = SuccessRes({ message: '不能重复添加' });
      return;
    }
    await user.update({ collection: [ ...userObj.collection, vid ] });
    ctx.body = SuccessRes({
      message: '添加收藏成功',
    });
  }
  async removeCollection() {
    const ctx = this.ctx;
    let { uid, vid } = ctx.request.body;
    uid = toInt(uid);
    vid = toInt(vid);
    const user = await ctx.model.User.findByPk(uid);
    if (!user) {
      // ctx.status = 404;
      ctx.body = ErrorRes('用户不存在');
      return;
    }
    const userObj = toObj(user);
    const collection = [ ...userObj.collection ];
    if (collection.includes(vid)) {
      const index = collection.findIndex(e => e === vid);
      collection.splice(index, 1);
      await user.update({ collection });
      ctx.body = SuccessRes({
        message: '取消收藏成功',
      });
    }
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      // ctx.status = 404;
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
      // ctx.status = 404; // 未找到
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
