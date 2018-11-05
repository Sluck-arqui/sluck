const KoaRouter = require('koa-router');

const profile = require('./routes/profile');
const main = require('./routes/main');
const messages = require('./routes/messages');
const groups = require('./routes/groups');
const hashtags = require('./routes/hashtags');
const session = require('./routes/session');

const router = new KoaRouter();

router.use(async (ctx, next) => {
  Object.assign(ctx.state, {
    currentUser: ctx.session.userId && await ctx.orm.userKey.findAll({ where: { userId: ctx.session.userId } }),
    destroySessionPath: ctx.router.url('session-destroy'),
    createGroupPath: ctx.router.url('create-group-submit'),
//    addMessageGroupPath: ctx.router.url('messages-group-add'),
  });
  return next();
});

router.use('/', main.routes());
router.use('/messages', messages.routes());
router.use('/groups', groups.routes());
router.use('/hashtags', hashtags.routes());
router.use('/session', session.routes());
router.use('/profile', profile.routes());

module.exports = router;
