const KoaRouter = require('koa-router');

const profile = require('./routes/profile');
const main = require('./routes/main');
const messages = require('./routes/messages');
const groups = require('./routes/groups');
const session = require('./routes/session');


const router = new KoaRouter();

router.use('/', main.routes());
router.use('/messages', messages.routes());
router.use('/groups', groups.routes());
router.use('/session', session.routes());
router.use('/profile', profile.routes());

module.exports = router;
