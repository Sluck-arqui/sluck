const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const messages = require('./routes/messages');


const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/messages', messages.routes());

module.exports = router;
