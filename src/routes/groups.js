const KoaRouter = require('koa-router');
const { queryEngine } = require('../lib/queryEngine.js');


const router = new KoaRouter();

const API_URL = 'IP server API'; // probablemente process.env.API_URL

router.param('id', async (id, ctx, next) => {
    const headers = await queryEngine.fetchHeaders(API_URL);
    const messages = await queryEngine.fetchMessagesGroup(API_URL, headers, id);
    ctx.assert(message, 404);
    ctx.state.message = message;
    return next();
  });
  

router.get('messages-group-show', '/:id', async (ctx) => {
  const { messages } = ctx.state;
  
  await ctx.render('groups/show', {
    messages,
    // esta url se pasa para después crear form para agregar comentario
    addCommentPath: message => ctx.router.url('messages-add-comment', message.id),
  });
});
