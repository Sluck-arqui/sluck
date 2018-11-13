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


router.post('new-hashtag-search', '/', async (ctx) => {
  const headers = { 'OAuth-Token': ctx.session.currentToken };
  // console.log('headers are', headers);
  // const text = ctx.request.url.split('?')[1].split('=')[1];
  const { text } = ctx.request.body;
  // console.log('params are', ctx.params);
  // const { text } = ctx.params;
  console.log('text es', text);
  const { limit } = 10;
  let search = await queryEngine.fetchHashtagSearch(API_URL, headers, text, limit);
  ctx.assert(search, 404);
  search = JSON.stringify(search);
  await ctx.render('search/show', {
    search,
  });
});

router.post('new-username-search', '/username/', async (ctx) => {
  const headers = { 'OAuth-Token': ctx.session.currentToken };
  // console.log('headers are', headers);
  // const username = ctx.request.url.split('?')[1].split('=')[1];
  console.log(ctx.state);
  const { username } = ctx.request.body;
  console.log('username es', username);
  const { limit } = 10;
  let search = await queryEngine.fetchUsernameSearch(API_URL, headers, username, limit);
  ctx.assert(search, 404);
  search = JSON.stringify(search);
  await ctx.render('search/usernameShow', {
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
