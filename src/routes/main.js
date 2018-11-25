const KoaRouter = require('koa-router');
const queryEngine = require('../lib/queryEngine.js');

const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl';

router.get('index', '/', async (ctx) => {
  ctx.session.tokenOtherAPI = await queryEngine.authOtherAPI();
  if (ctx.session.currentUserId === undefined) {
    await ctx.redirect(ctx.router.url('session-new'));
  } else {
    console.log('EL USUARIO ESTÁ LOGGEADO');
    const headers = { 'Oauth-token': ctx.session.currentToken };
    const { currentUserTokenOtherAPI, currentUserIdOtherAPI } = ctx.session;
    let [response, response2] = await queryEngine.fetchMemberships(API_URL, headers, currentUserIdOtherAPI, currentUserTokenOtherAPI);
    if (response.status_text) {
      response = [];
    }
    console.log('USER BELONGS TO GROUPS: \n', response);
    console.log('USER BELONGS TO GROUPS2: \n', response2);
    const myGroups = [];
    // if (response.groups) {
    //   for (let i = 0; i < response.groups.length; i += 1) {
    //     const groupId = response.groups[i];
    //     const grp = await queryEngine.fetchGroup(API_URL, headers, groupId, ctx.session.currentTokenOtherAPI);
    //     myGroups.push(grp);
    //   }
    // }
    if (Math.max(response.length, response2.length) > 0) {
      let groupId;
      let postId;
      for (let i = 0; i < Math.max(response.length, response2.length); i += 1) {
        if (response.length > i) {
          groupId = response[i];
        } else {
          groupId = -3;
        }
        if (response2.length > i) {
          postId = response2[i].postId;
        } else {
          postId = -3;
        }
        // (API_URL, headers, id, postId, tokenOtherAPI)
        const grp = await queryEngine.fetchGroup(API_URL, headers, groupId, postId, ctx.session.tokenOtherAPI);
        myGroups.push(grp.group);
      }
    }
    

    await ctx.render(
      'index',
      {
        groups: myGroups,
        newHashtagSearch: hashtag => ctx.router.url('new-hashtag-search', { hashtag: hashtag }),
        newUsernameSearch: username => ctx.router.url('new-username-search', { searchName: username }),
        destroySessionPath: ctx.router.url('session-destroy'),
        currentUser: ctx.session.currentUsername,
      },
    );
  }
});

module.exports = router;
