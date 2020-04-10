'use strict';

const { myDecode } = require('../utils/encode');
const { ErrorRes } = require('../utils/response');

module.exports = options => {
  return async function handleToken(ctx, next) {
    const { tokenKey, baseContent, whiteList, keeptime } = options;
    const { url } = ctx.request;
    if (!whiteList.includes(url)) {
      const token = ctx.request.header[tokenKey];
      if (!token) {
        ctx.status = 400;
        ctx.body = ErrorRes('非法请求');
        return;
      }
      const [ postbaseContent = '', tokenString = '' ] = token.split(' ');
      const { res, time } = myDecode(tokenString, ctx.app.config.tokenPrivate);
      const now = Date.now();
      const userid = res.split('-')[0] || '';
      if (postbaseContent === baseContent && userid.trim()) {
        if (now - Number(time) > keeptime) {
          ctx.status = 400;
          ctx.body = ErrorRes('token 已过期');
          return;
        }
        await next();
      } else {
        ctx.status = 400;
        ctx.body = ErrorRes('非法 token');
        return;
      }
    } else {
      await next();
    }
  };
};
