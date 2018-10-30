const KoaRouter = require('koa-router');
const pkg = require('../../package.json');
const queryEngine  = require('../lib/queryEngine.js');


const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl';

router.get('/', async (ctx) => {
  const headers = await queryEngine.signUpAPI(API_URL, "aa", "AA", "BB", "aa@bb.com", "some_password");
  // console.log(headers);
  await ctx.render('index', {
    appVersion: pkg.version,
  });
});

module.exports = router;
