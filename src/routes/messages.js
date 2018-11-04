const KoaRouter = require('koa-router');
const { queryEngine } = require('../lib/queryEngine.js');


const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl'; // probablemente process.env.API_URL

router.param('id', async (id, ctx, next) => {
  const { headers } = ctx.session;
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
  await queryEngine.postCommentMessage(API_URL, headers, message.id, ctx.request.body.comment_text);
  ctx.redirect('/');
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
  await queryEngine.postMessageReaction(API_URL, headers, message.id, 1);
  // algún redirect
});

router.post('messages-add-dislike', '/:id', async (ctx) => {
  const { message } = ctx.state;
  const { headers } = ctx.state;
  await queryEngine.postMessageReaction(API_URL, headers, message.id, 2);
  // algún redirect
});

router.get('messages-reactions', '/:id', async (ctx) => {
  const { message } = ctx.state;
  const { headers } = ctx.state;
  const reactions = await queryEngine.fetchReactions(API_URL, headers, message.id);
  await ctx.render('messages/show-reactions', {
    reactions,
  });
});

router.post('messages-add-comment', '/:id', async (ctx) => {
  const { message } = ctx.state;
  const { headers } = ctx.state;
  const { text } = ctx.req.body; // debería haber input en form que se llame text
  await queryEngine.postCommentMessage(API_URL, headers, message.id, text);
  ctx.redirect('/');
});


module.exports = router;
