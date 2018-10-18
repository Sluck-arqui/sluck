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
    addCommentPath: ctx.router.url('add-comment-message', message.id),
  });
});

router.post('add-comment-message', '/:id', async (ctx) => {
//   Acá va otra ruta, su url se pasó arriba para poder crear un form donde se agrega comentario al mensaje
});