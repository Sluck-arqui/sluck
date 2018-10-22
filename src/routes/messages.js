const KoaRouter = require('koa-router');
const { queryEngine } = require('../lib/queryEngine.js');


const router = new KoaRouter();

const API_URL = 'IP server API'; // probablemente process.env.API_URL

router.param('id', async (id, ctx, next) => {
    const headers = await queryEngine.fetchHeaders(API_URL);
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
    addCommentPath: ctx.router.url('add-comment-message', message.id),
  });
});

// postCommentMessage = async (API_URL, headers, id, comment_text)
router.post('add-comment-message', '/:id', async (ctx) => {
  const { message } = ctx.state;
  // probablemente estos headers deberían ser una cookie/session
  const headers = await queryEngine.fetchHeaders(API_URL);
  // esto supone que se mandó por el post un field comment_text
  await postCommentMessage(API_URL, headers, message.id, ctx.request.body.comment_text);
  
  ctx.redirect("/");

});
