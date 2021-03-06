'use strict';

const { myDecode } = require('../utils/encode');
const { ErrorRes } = require('../utils/response');

const inWhiteList = (url, method, array) => {
  return array.includes(url) || array.some(e => {
    return typeof e === 'object'
      && e.method && (e.method.includes(method))
      && e.url && (e.url.includes(url) || url.includes(e.url));
  });
};


module.exports = options => {
  return async function handleToken(ctx, next) {
    const { tokenKey, baseContent, whiteList, keeptime } = options;
    const { url, method } = ctx.request;
    if (inWhiteList(url, method.toLocaleUpperCase(), whiteList)) {
      await next();
      // 继续往后走，进入 Controller
    } else {
      const token = ctx.request.header[tokenKey];
      if (!token) {
        // ctx.status = 400;
        ctx.body = ErrorRes('非法请求');
        return;
      }
      const [ postbaseContent = '', tokenString = '' ] = token.split(' ');
      const { res = '', time = 0 } = myDecode(tokenString, ctx.app.config.tokenPrivate);
      const [ userid = '', username = '' ] = res.split('-');
      const ifuser = userid && await ctx.model.User.findOne({
        where: { id: userid },
      });
      if (postbaseContent === baseContent && ifuser.username === username) {
        if (Date.now() - Number(time) > keeptime) {
          // ctx.status = 400;
          ctx.body = ErrorRes('token 已过期');
          return;
        }
        const hasSessionToken = await ctx.model.Loginsession.findOne({ where: { userid } });
        if (!hasSessionToken || hasSessionToken.token !== tokenString) {
          // ctx.status = 400;
          ctx.body = ErrorRes('token 已失效');
          return;
        }
        await next();
      } else {
        // ctx.status = 400;
        ctx.body = ErrorRes('非法 token');
        return;
      }
    }
  };
};
