const KoaRouter = require('koa-router');
const pkg = require('../../package.json');
const queryEngine  = require('../lib/queryEngine.js');


const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl';

router.get('/', async (ctx) => {
  // const headers = await queryEngine.signUpAPI(API_URL, "King", "Arturo", "Vidal", "av@bm.com", "Goles123");
  //
  // // const headers = await queryEngine.loginAPI(API_URL, "aa", "some_password");
  // ctx.session.headers = headers;

  // console.log(headers);
  await ctx.render('index', {
    appVersion: pkg.version,
  });
});

module.exports = router;
