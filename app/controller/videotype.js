'use strict';
const Controller = require('egg').Controller;
const { SuccessRes, ErrorRes, toObj, toInt } = require('../utils/response');

class VideoTypeController extends Controller {
  async index() {
    const ctx = this.ctx;
    const result = await ctx.model.Videotypes.findAll();
    const rs = toObj(result);
    if (rs.length > 0) {
      for (const item of rs) {
        item.videocount = await this.findVideoCountByTypeId(item.id);
      }
    }
    ctx.body = result.length === 0 ? ErrorRes('暂无数据') : SuccessRes(rs);
  }

  async create() {
    const ctx = this.ctx;
    const { typename } = ctx.request.body;
    const videotype = await ctx.model.Videotypes.create({
      typename,
      created_time: Date.now(),
    });
    ctx.status = 201; //  表示已创建
    ctx.body = SuccessRes(videotype); // 响应前端body
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const videotype = await ctx.model.Videotypes.findByPk(id);
    if (!videotype) {
      // ctx.status = 404; // 未找到
      ctx.body = ErrorRes('视频类型不存在');
      return;
    }

    const { typename } = ctx.request.body;
    await videotype.update({ typename });
    ctx.body = SuccessRes(videotype);
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const videotype = await ctx.model.Videotypes.findByPk(id);
    if (!videotype) {
      // ctx.status = 404;
      ctx.body = ErrorRes('视频类型不存在');
      return;
    }
    const count = await this.findVideoCountByTypeId(id);
    if (count > 0) {
      ctx.status = 200; // "ok"
      ctx.body = ErrorRes('该栏目下视频不为空，无法删除该栏目');
    } else {
      await videotype.destroy();
      ctx.status = 200; // "ok"
      ctx.body = SuccessRes({ message: '删除成功' });
    }
  }

  async findVideoCountByTypeId(id) {
    const ctx = this.ctx;
    ctx.model.Video.belongsTo(ctx.model.Videotypes, { foreignKey: 'videotypeid', targetKey: 'id' });
    const query = {
      where: { videotypeid: id },
      order: [[ 'id', 'DESC' ]],
      include: [
        {
          model: ctx.model.Videotypes,
          required: true,
        },
      ],
    };
    const { count } = await ctx.model.Video.findAndCountAll(query);
    return count;
  }


}

module.exports = VideoTypeController;
