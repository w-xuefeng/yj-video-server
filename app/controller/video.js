'use strict';
const Controller = require('egg').Controller;
const { SuccessRes, ErrorRes } = require('../utils/response');
const { delfilePath } = require('../utils/file');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class VideoController extends Controller {
  async index() {
    const ctx = this.ctx;
    ctx.model.Video.belongsTo(ctx.model.Videotypes, { foreignKey: 'videotypeid', targetKey: 'id' });
    const where = ctx.query.videotypeid ? { videotypeid: ctx.query.videotypeid } : undefined;
    const query = {
      limit: toInt(ctx.query.limit),
      offset: toInt(ctx.query.offset),
      where,
      order: [[ 'id', 'DESC' ]],
      include: [
        {
          model: ctx.model.Videotypes,
          required: true,
        },
      ],
    };
    const { count, rows } = await ctx.model.Video.findAndCountAll(query);
    ctx.body = count === 0 ? ErrorRes('暂无数据') : { ...SuccessRes(rows), count };
  }

  async search() {
    const ctx = this.ctx;
    ctx.model.Video.belongsTo(ctx.model.Videotypes, { foreignKey: 'videotypeid', targetKey: 'id' });
    const query = {
      limit: toInt(ctx.query.limit),
      offset: toInt(ctx.query.offset),
      where: {
        videoname: {
          [this.app.Sequelize.Op.like]: `%${ctx.query.videoname}%`,
        },
      },
      order: [[ 'id', 'DESC' ]],
      include: [
        {
          model: ctx.model.Videotypes,
          required: true,
        },
      ],
    };
    const { count, rows } = await ctx.model.Video.findAndCountAll(query);
    ctx.body = count === 0 ? ErrorRes('暂无数据') : { ...SuccessRes(rows), count };
  }

  async recommend() {
    const ctx = this.ctx;
    ctx.model.Video.belongsTo(ctx.model.Videotypes, { foreignKey: 'videotypeid', targetKey: 'id' });
    const result = await ctx.model.Video.findAll({
      limit: ctx.query.limit || 5,
      order: this.app.Sequelize.random,
      include: [
        {
          model: ctx.model.Videotypes,
          required: true,
        },
      ],
    });
    ctx.body = result.length === 0 ? ErrorRes('暂无数据') : SuccessRes(result);
  }

  async show() {
    const ctx = this.ctx;
    ctx.model.Video.belongsTo(ctx.model.Videotypes, { foreignKey: 'videotypeid', targetKey: 'id' });
    const query = {
      where: { id: toInt(ctx.params.id) },
      include: [
        {
          model: ctx.model.Videotypes,
          required: true,
        },
      ],
    };
    const video = await ctx.model.Video.findOne(query);
    ctx.body = video ? SuccessRes(video) : ErrorRes('视频不存在');
  }

  async create() {
    const ctx = this.ctx;
    const {
      videoname = '',
      videourl = '',
      videotypeid = 1,
      videocover = '',
      videotime = '',
      videosize = '',
    } = ctx.request.body;
    const video = await ctx.model.Video.create({
      videoname,
      videosize,
      videotypeid,
      videourl,
      videotime,
      videocover,
      created_time: Date.now(),
    });
    ctx.status = 201; // 表示已创建
    ctx.body = SuccessRes(video); // 响应前端body
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const video = await ctx.model.Video.findByPk(id);
    if (!video) {
      // ctx.status = 404;
      ctx.body = ErrorRes('视频不存在');
      return;
    }

    const {
      videoname,
      videourl,
      videotypeid,
      videocover,
      videotime,
      videosize,
    } = ctx.request.body;
    await video.update({
      videoname,
      videourl,
      videotypeid,
      videocover,
      videotime,
      videosize,
    });
    ctx.body = SuccessRes(video);
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const video = await ctx.model.Video.findByPk(id);
    if (!video) {
      // ctx.status = 404; // 未找到
      ctx.body = ErrorRes('视频不存在');
      return;
    }
    const videocoverFlag = delfilePath(video.videocover);
    const videoFlag = delfilePath(video.videourl);
    await video.destroy();
    ctx.status = 200; // "ok"
    ctx.body = SuccessRes({
      message: '删除成功',
      videocoverFlag,
      videoFlag,
    });
  }
}

module.exports = VideoController;
