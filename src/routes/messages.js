const KoaRouter = require('koa-router');
const { queryEngine } = require('../lib/queryEngine.js');


const router = new KoaRouter();

const API_URL = 'IP server API'; // probablemente process.env.API_URL

router.param('id', async (id, ctx, next) => {
    const headers = await queryEngine.fetchHeaders(API_URL);
    ctx.state.headers = headers;
    const message = await queryEngine.fetchMessage(API_URL, headers, id);
    ctx.assert(message, 404);
    ctx.state.message = message;
    return next();
  });
  

router.get('messages-show', '/:id', async (ctx) => {
  const { message } = ctx.state;
  
  await ctx.render('messages/show', {
    message,
    // esta url se pasa para después crear form para agregar comentario
    addCommentPath: ctx.router.url('messages-add-comment', message.id),
  });
});

router.post('messages-add-comment', '/:id', async (ctx) => {
  const { message } = ctx.state;
  const { headers } = ctx.state;
  // esto supone que se mandó por el post un field comment_text
  await postCommentMessage(API_URL, headers, message.id, ctx.request.body.comment_text);
  
  ctx.redirect("/");

});


router.delete('messages-destroy', '/:id', async (ctx) => {
  const { message } = ctx.state;
  const { headers } = ctx.state;
  await queryEngine.deleteMessage(API_URL, headers, message.id);
  await ctx.render('/');
});

router.post('messages-add-like', '/:id', async (ctx) => {
  const { message } = ctx.state;
  const { headers } = ctx.state;
  await queryEngine.postLike(API_URL, headers, message.id);
  // algún redirect
});

router.post('messages-add-dislike', '/:id', async (ctx) => {
  const { message } = ctx.state;
  const { headers } = ctx.state;
  await queryEngine.postDislike(API_URL, headers, message.id);
  // algún redirect
});

router.get('messages-reactions', '/:id', async (ctx) => {
  const { message } = ctx.state;
  const reactions = await queryEngine.fetchReactions(API_URL, headers, id);
  await ctx.render('messages/show-reactions', {
    reactions,
  });
});

module.exports = router;
