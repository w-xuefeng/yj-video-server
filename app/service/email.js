'use strict';

const Service = require('egg').Service;
const nodemailer = require('nodemailer');

class EmailService extends Service {

  async sendMail(email, subject, text, html) {

    const transporter = nodemailer.createTransport({
      service: 'qq',
      secureConnection: true,
      port: 465,
      auth: {
        user: this.ctx.app.config.email.host, // 账号
        pass: this.ctx.app.config.email.pass, // 授权码
      },
    });

    const mailOptions = {
      from: `"${this.ctx.app.config.email.name}" <${this.ctx.app.config.email.host}>`, // 发送者,与上面的user一致
      to: email, // 接收者,可以同时发送多个,以逗号隔开
      subject, // 标题
      text, // 文本
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      return false;
    }
  }

}

module.exports = EmailService;
