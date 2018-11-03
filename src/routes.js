const KoaRouter = require('koa-router');

const main = require('./routes/main');
const profile = require('./routes/profile');
const session = require('./routes/session');

const router = new KoaRouter();

router.use('/', main.routes());
router.use('/profile', profile.routes());
router.use('/session', session.routes());

module.exports = router;
