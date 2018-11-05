const KoaRouter = require('koa-router');
const queryEngine = require('../lib/queryEngine.js');

const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl'; // probablemente process.env.API_URL


// router.param('limit', async (limit, ctx, next) => {
//   ctx.state.limit = limit;
//   return next();
// });


//router.param('text', async (text, limit, ctx, next) => {
//  ctx.state.limit = limit;
//  ctx.state.text = text;
//  return next();
//});


router.get('show-hashtag', '/:text', async (ctx) => {
  const { headers } = ctx.session;
  const { text } = ctx.params;
  const { limit } = 10;
  const search = await queryEngine.fetchHashtagSearch(API_URL, headers, text, limit);
  ctx.assert(search, 404);
  await ctx.render('search/show', {
    search,
  });
});

router.get('show-username', '/username/:text', async (ctx) => {
  const { headers } = ctx.session;
  const { text } = ctx.state;
  const { limit } = ctx.state;
  // En vez de text debería llamarse username, pero no tiene tanto sentido crear otro middleware
  const search = await queryEngine.fetchUsernameSearch(API_URL, headers, text, limit);
  ctx.assert(search, 404);
  await ctx.render('??', {
    search,
  });
});

module.exports = router;
