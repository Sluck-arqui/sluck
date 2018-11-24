const KoaRouter = require('koa-router');
const queryEngine  = require('../lib/queryEngine.js');

const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl';

router.get('index', '/', async (ctx) => {
  console.log('SESION ACTUAL', ctx.session);
  if (ctx.session.currentUserId === undefined) {
    ctx.flashMessage.notice = 'Debes hacer login o registrarte para entrar';
    await ctx.redirect(ctx.router.url('session-new'));
  } else {
    console.log('EL USUARIO ESTÁ LOGGEADO');
    const headers = { 'Oauth-token': ctx.session.currentToken };
    const { tokenOtherAPI } = ctx.session;
    const response = await queryEngine.fetchMemberships(API_URL, headers, tokenOtherAPI);
    console.log('USER BELONGS TO GROUPS: \n', response.groups);
    const myGroups = [];
    if (response.groups) {
      for (let i = 0; i < response.groups.length; i += 1) {
        const groupId = response.groups[i];
        const grp = await queryEngine.fetchGroup(API_URL, headers, groupId, ctx.session.currentTokenOtherAPI);
        myGroups.push(grp);
      }
    }
    await ctx.render(
      'index',
      {
        groups: myGroups,
        destroySessionPath: ctx.router.url('session-destroy'),
        currentUser: ctx.session.currentUsername,
      },
    );
  }
});

module.exports = router;
