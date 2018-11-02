const KoaRouter = require('koa-router');
const pkg = require('../../package.json');
const queryEngine  = require('../lib/queryEngine.js');


const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl';

router.get('/', async (ctx) => {
  if (ctx.session.currentUserId === undefined) {
    ctx.flashMessage.notice = 'Debes hacer login o registrarte para entrar';
    ctx.redirect(ctx.router.url('session-new'));
  }
  else {
    ctx.render('');
  }
});

module.exports = router;
