const KoaRouter = require('koa-router');
const queryEngine = require('../lib/queryEngine.js');

const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl';

router.get('index', '/', async (ctx) => {
  ctx.session.tokenOtherAPI = await queryEngine.authOtherAPI();
  console.log('SESION ACTUAL', ctx.session);
  if (ctx.session.currentUserId === undefined) {
    ctx.flashMessage.notice = 'Debes hacer login o registrarte para entrar';
    await ctx.redirect(ctx.router.url('session-new'));
  } else {
    console.log('EL USUARIO ESTÁ LOGGEADO');
    const headers = { 'Oauth-token': ctx.session.currentToken };
    const { currentUserTokenOtherAPI, currentUserIdOtherAPI } = ctx.session;
    const [response, response2] = await queryEngine.fetchMemberships(API_URL, headers, currentUserIdOtherAPI, currentUserTokenOtherAPI);
    console.log('USER BELONGS TO GROUPS: \n', response.groups);
    const myGroups = [];
    // if (response.groups) {
    //   for (let i = 0; i < response.groups.length; i += 1) {
    //     const groupId = response.groups[i];
    //     const grp = await queryEngine.fetchGroup(API_URL, headers, groupId, ctx.session.currentTokenOtherAPI);
    //     myGroups.push(grp);
    //   }
    // }
    if (response2) {
      for (let i = 0; i < response2.length; i += 1) {
        const groupId = response2[i].postId;
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
