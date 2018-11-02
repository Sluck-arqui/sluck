const KoaRouter = require('koa-router');
const router = new KoaRouter();
const { queryEngine } = require('../lib/queryEngine.js');

// La vista de log-in tendría que llamarse 'new' y estar en la carpeta 'views/session/', y tomar un parámetro
// message para reportar los errores si los hay.

router.get('session-new', '/', async (ctx) => {
  ctx.render('session/new',
            {
              msg: '',
              submitPath: ctx.router.url('session-create'),
            },)
});

router.put('session-create', '/', async (ctx) => {
  const { username, password } = ctx.request.body;
  const response = await queryEngine.loginAPI(API_URL, username, password);
  const user = response.user;
  if (response.status_code === 201) {
    ctx.session.currentUserId = user.id;
    ctx.flashMessage.notice = 'Inicio de sesión exitoso';
    ctx.redirect('/');
  } else {
    await ctx.render('session/new', {
      msg: 'nombre de usuario o contraseña incorrectos',
      submitPath: ctx.router.url('session-create'),
    });
  }
});

router.delete('session-destroy', '/', async (ctx) => {
  delete ctx.session.currentUserId;
  ctx.flashMessage.notice = 'Término de sesión exitoso';
  ctx.redirect('/');
});

module.exports = router;
