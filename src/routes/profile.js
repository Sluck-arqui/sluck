const KoaRouter = require('koa-router');
const queryEngine  = require('../lib/queryEngine.js');

const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl';

router.get('/', async (ctx) => {
});

module.exports = router;

