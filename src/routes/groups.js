const KoaRouter = require('koa-router');
const queryEngine = require('../lib/queryEngine.js');

const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl'; // probablemente process.env.API_URL

// router.param('id', async (id, ctx, next) => {
//  return next();
// });

router.get('create-group', '/new', async (ctx) => {
  await ctx.render('/groups/new', {
    layout: false,
    submitGroupPath: ctx.router.url('create-group-submit'),
  });
});

router.post('create-group-submit', '/new', async (ctx) => {
  const { name } = ctx.request.body;
  const { description } = ctx.request.body;
  // esto supone que se mandó por el post un field text
  console.log(ctx.session);
  const headers = {
    'Oauth-token': ctx.session.currentToken,
  };
  const ans = await queryEngine.createGroup(
    API_URL, headers, name,
    description, ctx.session.currentTokenOtherAPI,
  );
  const { topic_id } = ans[1];
  console.log(ans);
  await queryEngine.addMember(API_URL, headers, ans.id, ctx.session.currentUserId, topic_id, ctx.session.currentTokenOtherAPI);

  ctx.redirect(ctx.router.url('create-group'));
});

router.get('group-search', '/search/:name', async (ctx) => {
  console.log(ctx.params.name);
  await ctx.render('groups/index', {
    layout: false,
  });
});

router.get('group-show', '/:id', async (ctx) => {
  let token = ctx.session.currentToken;

  const headers = {"Oauth-token":token};
  const group = await queryEngine.fetchGroup(API_URL, headers, ctx.params.id, ctx.session.currentTokenOtherAPI);
  let messages = [];
  console.log(group.messages);
  for(var i = 0; i < group.messages.length; i++){
    console.log(`[i] Fetching message ${group.messages[i]}`);
    let ask = group.messages[i];
    const aux = await queryEngine.fetchMessage(API_URL, headers, ask);
    messages.push(aux);
  }
  await ctx.render('groups/view', {
    layout: false,
    group,
    messages,
    addMemberPath: ctx.router.url('add-member-group',{"id":ctx.params.id}),
    submitMessagePath: ctx.router.url('messages-group-add',{"id":ctx.params.id}),
  });
});

router.post('messages-group-add', '/message/:id', async (ctx) => {
  const {group_id} = ctx.params.id;
  const headers = {"Oauth-token":ctx.session.currentToken};
  const {text} = ctx.request.body.message;
  // esto supone que se mandó por el post un field text
  await queryEngine.postMessageGroup(API_URL, headers, ctx.params.id, ctx.request.body.message);
  ctx.redirect(ctx.router.url('group-show',{"id":ctx.params.id}));
});

router.post('add-member-group', '/:id', async (ctx) => {
  try {
    const { user_id } = ctx.request.body.user_id;
    const { group } = ctx.params.id;
    const { headers } = ctx.state;
    // esto supone que se mandó por el post un field text
    // CÓMO CONSEGUIR EL ID EN LA OTRA API?
    // pedir todos los  http://charette9.ing.puc.cl/api/topics y buscar ahí
    const topic_id = await queryEngine.getTopicId(group, ctx.session.currentTokenOtherAPI);

    await queryEngine.addMember(API_URL, headers, group.id, user_id, topic_id, ctx.session.currentTokenOtherAPI);
  } catch (e) {
    //nada
  }
  ctx.redirect('/');
});

router.post('delete-member-group', '/:id', async (ctx) => {
  const { user_id } = ctx.request.body;
  const { group } = ctx.state;
  const { headers } = ctx.state;
  // esto supone que se mandó por el post un field text
  await queryEngine.removeMember(API_URL, headers, group.id, user_id);
  ctx.redirect('/');
});

module.exports = router;
