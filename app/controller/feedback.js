'use strict';

const Controller = require('egg').Controller;
const { SuccessRes, ErrorRes } = require('../utils/response');

class FeedbackController extends Controller {
  async index() {
    const { ctx } = this;
    const { content = '', feedbacker = '' } = ctx.request.body;
    let res = SuccessRes({ message: '反馈成功， 您的反馈已成功告知管理员' });
    if (content.trim() && feedbacker.trim()) {
      const email = this.ctx.app.config.email.feedback;
      const subject = '猿学网用户反馈';
      const text = `来自 ${feedbacker} 的用户反馈：\n\r${content}`;
      const send = await this.service.email.sendMail(email, subject, text);
      res = send ? res : ErrorRes('网络波动，请您重试一次');
    }
    ctx.body = res;
  }
}

module.exports = FeedbackController;
