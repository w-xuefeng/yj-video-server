'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.resources('users', '/users', controller.users);
  router.get('users', '/getusers', controller.users.getUsers);
  router.resources('banners', '/banners', controller.banner);
  router.resources('comments', '/comments', controller.comment);
  router.get('comments', '/comments/video', controller.comment.findCommentsByVideoId);
  router.get('comments', '/comments/user', controller.comment.findCommentsByUserId);
  router.get('videos', '/videos/recommend', controller.video.recommend);
  router.get('videos', '/videos/search', controller.video.search);
  router.resources('videos', '/videos', controller.video);
  router.resources('videotypes', '/videotypes', controller.videotype);
  router.post('/login', controller.session.login);
  router.post('/login/admin', controller.session.loginAdmin);
  router.post('/upload', controller.upload.upload);
  router.delete('/delfile', controller.upload.delfile);
};
