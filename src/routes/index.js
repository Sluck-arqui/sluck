const KoaRouter = require('koa-router');
const pkg = require('../../package.json');
const queryEngine  = require('../lib/queryEngine.js');


const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl';

router.get('/', async (ctx) => {
  // console.log(headers);
  await ctx.render('index', {
    ctx,
    appVersion: pkg.version,
  });
});

module.exports = router;
