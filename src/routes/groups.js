const KoaRouter = require('koa-router');
const { queryEngine } = require('../lib/queryEngine.js');


const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl'; // probablemente process.env.API_URL

router.param('id', async (id, ctx, next) => {
  const { headers } = ctx.session;
  const group = await queryEngine.fetchGroup(API_URL, headers, id);
  ctx.assert(group, 404);
  ctx.state.messages = group;
  return next();
});


router.get('messages-group-show', '/:id', async (ctx) => {
  const { group } = ctx.state;

  await ctx.render('??', {
    group,
    // esta url se pasa para después crear form para agregar comentario
    addCommentPath: message => ctx.router.url('messages-add-comment', message.id),
  });
});

router.post('messages-group-add', '/message/:id', async (ctx) => {
  const { group } = ctx.state;
  const { headers } = ctx.session;
  const { text } = ctx.request.body;
  // esto supone que se mandó por el post un field text
  await queryEngine.postMessageGroup(API_URL, headers, group.id, text);
  ctx.redirect('/');
});

router.post('create-group', '/', async (ctx) => {
  const { name } = ctx.request.body;
  const { description } = ctx.request.body;
  const { headers } = ctx.session;
  // esto supone que se mandó por el post un field text
  await queryEngine.createGroup(API_URL, headers, name, description);
  ctx.redirect('/');
});

router.post('add-member-group', '/:id', async (ctx) => {
  const { user_id } = ctx.request.body;
  const { group } = ctx.state;
  const { headers } = ctx.session;
  // esto supone que se mandó por el post un field text
  await queryEngine.addMember(API_URL, headers, group.id, user_id);
  ctx.redirect('/');
});

router.post('delete-member-group', '/:id', async (ctx) => {
  const { user_id } = ctx.request.body;
  const { group } = ctx.state;
  const { headers } = ctx.session;
  // esto supone que se mandó por el post un field text
  await queryEngine.removeMember(API_URL, headers, group.id, user_id);
  ctx.redirect('/');
});

module.exports = router;
