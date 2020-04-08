'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.resources('users', '/users', controller.users);
  router.resources('banners', '/banners', controller.banner);
  router.resources('comments', '/comments', controller.comment);
  router.get('comments', '/comments/video', controller.comment.findCommentsByVideoId);
  router.get('comments', '/comments/user', controller.comment.findCommentsByUserId);
  router.resources('videos', '/videos', controller.video);
  router.resources('videotype', '/videotype', controller.videotype);
};
