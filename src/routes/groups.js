const KoaRouter = require('koa-router');
const queryEngine = require('../lib/queryEngine.js');

const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl'; // probablemente process.env.API_URL

//router.param('id', async (id, ctx, next) => {
//  return next();
//});

router.get('create-group', '/new', async (ctx) => {
  await ctx.render('/groups/new', {
	layout: false,
        submitGroupPath: ctx.router.url('create-group-submit')
  });
});

router.post('create-group-submit', '/new', async (ctx) => {
  const { name } = ctx.request.body;
  const { description } = ctx.request.body;
  // esto supone que se mandó por el post un field text
  let headers = {
	"Oauth-token": ctx.session.currentToken
  };
  let ans = await queryEngine.createGroup(API_URL, headers, name, description);
  console.log(ans);
  await queryEngine.addMember(API_URL, headers, ans.id, ctx.session.currentUserId);

  ctx.redirect(ctx.router.url('create-group'));
});

router.get('group-show', '/:id', async (ctx) => {
  let result = await ctx.orm.userKey.findOne({ where: {userId: ctx.session.currentUserId.toString()}})
  let token = result.token

  const headers = {"Oauth-token":token};
  const group = await queryEngine.fetchGroup(API_URL, headers, ctx.params.id);
  let messages = [];
  console.log(group.messages);
  for(var i = 0; i < group.messages.length; i++){
    console.log(`[i] Fetching message ${group.messages[i]}`);
    let ask = group.messages[i];
    const aux = await queryEngine.fetchMessage(API_URL, headers, ask);
    messages.push(aux);
  }

//group.messages.forEach((message) => {
  // const aux = queryEngine.fetchMessage(API_URL, headers, message.id);
//	message.push(aux);
// });
  await ctx.render('groups/view', {
    layout: false,
    group,
    messages,
    // esta url se pasa para después crear form para agregar comentario
    addCommentPath: message => ctx.router.url('messages-add-comment', message.id),
    addMessageGroupPath: ctx.router.url('messages-group-add'), 
});
});

router.post('messages-group-add', '/message/:id', async (ctx) => {
  const { group } = ctx.state;
  const { headers } = ctx.state;
  const { text } = ctx.request.body;
  // esto supone que se mandó por el post un field text
  await queryEngine.postMessageGroup(API_URL, headers, group.id, text);
  ctx.redirect('/');
});

router.post('add-member-group', '/:id', async (ctx) => {
  const { user_id } = ctx.request.body;
  const { group } = ctx.state;
  const { headers } = ctx.state;
  // esto supone que se mandó por el post un field text
  await queryEngine.addMember(API_URL, headers, group.id, user_id);
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
