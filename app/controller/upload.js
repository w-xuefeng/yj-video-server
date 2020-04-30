'use strict';

const path = require('path');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
const { SuccessRes, ErrorRes } = require('../utils/response');
const Controller = require('egg').Controller;

class UploaderController extends Controller {
  async upload() {
    const ctx = this.ctx;
    const stream = await ctx.getFileStream();
    const { type = '' } = stream.fields;
    const { uploadPath } = ctx.app.config;

    let basePath = path.resolve(__dirname, '../public/uploads/');
    let imgbaseurl = '/public/uploads/';

    const bannerPath = path.resolve(__dirname, `../${uploadPath.bannerPath}`);
    const videoCoverPath = path.resolve(__dirname, `../${uploadPath.videoCoverPath}`);
    const videoPath = path.resolve(__dirname, `../${uploadPath.videoPath}`);

    if (type === 'banner') {
      basePath = bannerPath;
      imgbaseurl = uploadPath.bannerPath;
    } else if (type === 'videocover') {
      basePath = videoCoverPath;
      imgbaseurl = uploadPath.videoCoverPath;
    } else if (type === 'video') {
      basePath = videoPath;
      imgbaseurl = uploadPath.videoPath;
    }
    const fileName = `${Date.now()}-${path.basename(stream.filename)}`;
    const imgurl = `/${imgbaseurl}/${fileName}`.replace(/\/\//g, '/');
    const httpimgurl = `${this.ctx.origin}${imgurl}`;

    const target = `${basePath}/${fileName}`;

    const result = await new Promise((resolve, reject) => {

      const remoteFileStrem = fs.createWriteStream(target);

      stream.pipe(remoteFileStrem);

      let errFlag;
      // 监听error事件
      remoteFileStrem.on('error', err => {
        errFlag = true;
        // 停止写入
        sendToWormhole(stream);
        remoteFileStrem.destroy();
        console.log(err);
        reject(err);
      });
      // 监听写入完成事件
      remoteFileStrem.on('finish', () => {
        if (errFlag) return;
        resolve({ url: imgurl, httpurl: httpimgurl });
      });
    });
    ctx.body = SuccessRes(result);
  }
  async delfile() {
    const ctx = this.ctx;
    const { url = '' } = ctx.request.body;
    const realPath = path.resolve(__dirname, url.replace(new RegExp(this.ctx.origin), '..'));
    console.log(realPath, fs.existsSync(realPath));
    if (fs.existsSync(realPath)) {
      fs.unlinkSync(realPath);
      ctx.body = SuccessRes({ message: '文件删除成功' });
    } else {
      ctx.body = ErrorRes('文件不存在');
    }
  }
}

module.exports = UploaderController;
