const KoaRouter = require('koa-router');
const queryEngine  = require('../lib/queryEngine.js');

const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl';

router.get('main','/', async (ctx) => {
  if (ctx.session.currentUserId === undefined) {
    ctx.flashMessage.notice = 'Debes hacer login o registrarte para entrar';
    await ctx.redirect(ctx.router.url('session-new'));
  }
  else {
    console.log("logged user");
    await ctx.render('index');
  }
});

module.exports = router;
