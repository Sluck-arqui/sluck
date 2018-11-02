const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const messages = require('./routes/messages');
const groups = require('./routes/groups');
const session = require('./routes/session');


const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/messages', messages.routes());
router.use('/groups', groups.routes());
router.use('/session', session.routes());

module.exports = router;
