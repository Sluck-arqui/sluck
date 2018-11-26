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
  // console.log(ctx.session);
  const headers = {
    'Oauth-token': ctx.session.currentToken,
  };
  const group = await queryEngine.createGroup(
    API_URL, headers, name,
    description, ctx.session.tokenOtherAPI,
  );
  const { id } = group[1];
  // console.log(group);
  // console.log('SESSION BEFORE ADD MEMBER:\n', ctx.session);
  await queryEngine.addMember(API_URL, headers, group[0].id, ctx.session.currentUserId, group[1].id, ctx.session.currentUserIdOtherAPI, ctx.session.currentUserTokenOtherAPI);

  ctx.redirect(ctx.router.url('create-group'));
});

router.get('group-search', '/search/:name', async (ctx) => {
  // console.log(ctx.params.name);
  await ctx.render('groups/index', {
    layout: false,
  });
});

router.get('group-show', '/:id1/:id2', async (ctx) => {
  let group;
  let messages;
  if (ctx.params.id1 != -3) {
    const token = ctx.session.currentToken;
    const headers = { 'OAuth-token': token };
    group = await queryEngine.fetchGroup(API_URL, headers, ctx.params.id1, ctx.params.id2, ctx.session.tokenOtherAPI);
    messages = [];
    console.log(group);
    // console.log(group.messages);
    for (let i = 0; i < group.messages.length; i++) {
      console.log(group.messages.length);
      // console.log(`[i] Fetching message ${group.messages[i]}`);
      const ask = group.messages[i];
      const aux = await queryEngine.fetchMessage(API_URL, headers, ask);
      messages.push(aux);
    }
  } else {
    const token = ctx.session.tokenOtherAPI;
    const headers = { 'OAuth-token': token };
    group = await queryEngine.fetchGroup(API_URL, headers, ctx.params.id1, ctx.params.id2, ctx.session.tokenOtherAPI);
    // console.log('group es ', group);
    // messages = group.group.messages2;
    messages = [];
    for (let i = 0; i < group.group.messages2.length; i++) {
      // console.log(messages.length);
      // console.log(`[i] Fetching message ${group.group.messages2[i]}`);
      const message = group.group.messages2[i];
      messages.push(message);
    }
  }
  console.log('este grupo se pasa');
  console.log(group);
  await ctx.render('groups/view', {
    layout: false,
    group,
    messages,
    addMemberPath: ctx.router.url('add-member-group', {"id1": ctx.params.id1, "id2": ctx.params.id2 }),
    submitMessagePath: ctx.router.url('messages-group-add',{"id1": ctx.params.id1, "id2": ctx.params.id2}),
  });
});

router.post('messages-group-add', '/message/:id1/:id2', async (ctx) => {
  const {groupId} = ctx.params.id1;
  const {postId} = ctx.params.id2;
  const headers = {
    'Oauth-token': ctx.session.currentToken,
  };
  const { text } = ctx.request.body.message;
  // esto supone que se mandó por el post un field text
  await queryEngine.postMessageGroup(API_URL, headers, ctx.params.id1, ctx.params.id2, ctx.request.body.message, ctx.session.tokenOtherAPI);
  ctx.redirect(ctx.router.url('group-show', { "id1": ctx.params.id1, "id2": ctx.params.id2 }));
});

router.post('add-member-group', '/:id1/:id2', async (ctx) => {
  try {
    const { userId } = ctx.params.id1;
    const { id2 } = ctx.params.id2;
    const { group } = ctx.params.id;
    const { headers } = ctx.state;
    // esto supone que se mandó por el post un field text
    // CÓMO CONSEGUIR EL ID EN LA OTRA API?
    // pedir todos los  http://charette9.ing.puc.cl/api/topics y buscar ahí

    // GET /services/{id}/people

    const urlPeople = `http://charette15.ing.puc.cl/api/services/184/people?access_token=${ctx.session.tokenOtherAPI}`;

    const topic_id = await queryEngine.getTopicId(group, ctx.session.currentTokenOtherAPI);

    await queryEngine.addMember(API_URL, headers, group.id, userId, id2, ctx.session.tokenOtherAPI);
  } catch (e) {
    //nada
  }
  ctx.redirect(ctx.router.url('group-show', { "id1": ctx.params.id1, "id2": ctx.params.id2 }));
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
