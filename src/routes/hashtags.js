const KoaRouter = require('koa-router');
const queryEngine = require('../lib/queryEngine.js');

const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl'; // probablemente process.env.API_URL

// router.param('limit', async (limit, ctx, next) => {
//   ctx.state.limit = limit;
//   return next();
// });


// router.param('username', async (username, ctx, next) => {
//   ctx.state.username = username;
//   return next();
// });


router.get('new-hashtag-search', '/:hashtag', async (ctx) => {
  const headers = { 'OAuth-Token': ctx.session.currentToken };
  // console.log('headers are', headers);
  // const text = ctx.request.url.split('?')[1].split('=')[1];
  const index = ctx.request.url.lastIndexOf('/');
  const text = ctx.request.url.substr(index + 1);
  // console.log('params are', ctx.params);
  // const { text } = ctx.params;
  console.log('text es', text);
  console.log(text);
  const { limit } = 10;
  let search = await queryEngine.fetchHashtagSearch(API_URL, headers, text, limit);
  ctx.assert(search, 404);
  search = JSON.stringify(search);
  await ctx.render('search/show', {
    layout: false,
    search,
  });
});

router.get('new-username-search', '/username/:searchName', async (ctx) => {
  const headers = { 'OAuth-Token': ctx.session.currentToken };
  // console.log('headers are', headers);
  // const username = ctx.request.url.split('?')[1].split('=')[1];
  console.log(ctx.request.url);


  const index = ctx.request.url.lastIndexOf('/');
  const username = ctx.request.url.substr(index + 1);
  console.log('username es', username);
  const { limit } = 10;
  let search = await queryEngine.fetchUsernameSearch(API_URL, headers, username, limit, ctx.session.tokenOtherAPI);
  console.log('SEARCH RESULTS', search);
  search = JSON.stringify(search);
  await ctx.render('search/usernameShow', {
    layout: false,
    search,
  });
});

// router.get('show-username', '/username/:text', async (ctx) => {
//   const { headers } = ctx.session;
//   const { text } = ctx.state;
//   const { limit } = ctx.state;
//   // En vez de text debería llamarse username, pero no tiene tanto sentido crear otro middleware
//   const search = await queryEngine.fetchUsernameSearch(API_URL, headers, text, limit);
//   ctx.assert(search, 404);
//   await ctx.render('serach/username-show', {
//     search,
//   });
// });

module.exports = router;
