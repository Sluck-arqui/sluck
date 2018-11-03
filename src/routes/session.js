const KoaRouter = require('koa-router');
const router = new KoaRouter();
const { queryEngine } = require('../lib/queryEngine.js');

// La vista de log-in tendría que llamarse 'new' y estar en la carpeta 'views/session/', y tomar un parámetro
// message para reportar los errores si los hay.

router.get('session-new', '/', async (ctx) => {
  console.log("Entramos al primer middleware. Ahora rendereamos.");
  await ctx.render('session/new',
            {
              msg: '',
              submitLoginPath: ctx.router.url('session-create-login'),
              submitSignupPath: ctx.router.url('session-create-signup'),
            },)
});

router.put('session-create-login', '/login', async (ctx) => {
  const { username, password } = ctx.request.body;
  const response = await queryEngine.loginAPI(API_URL, username, password);
  const user = response.user;
  if (response.status_code === 201) {
    const userkey = await ctx.orm.UserKey.build({
      'userId': user.id,
      'token': user.oauth_token,
    })
    await userkey.save();
    ctx.session.currentUserId = user.id;
    ctx.flashMessage.notice = 'Inicio de sesión exitoso';
    ctx.redirect('/');
  } else {
    await ctx.render('session/new', {
      msg: 'nombre de usuario o contraseña incorrectos',
      submitLoginPath: ctx.router.url('session-create-login'),
      submitSignupPath: ctx.router.url('session-create-signup'),
    });
  }
});

router.put('session-create-signup', '/signup', async (ctx) => {
  const {
    username,
    first_name,
    last_name,
    email,
    password } = ctx.request.body;
  const response = await queryEngine.signUpAPI((API_URL, username, first_name, last_name, email, password));
  if (response.status_code === 201) {
    const user = response.user;
    const userkey = await ctx.orm.UserKey.build({
      'userId': user.id,
      'token': user.oauth_token,
    })
    await userkey.save();
    ctx.session.currentUserId = user.id;
    ctx.flashMessage.notice = 'Inicio de sesión exitoso';
    ctx.redirect('/');
  } else {
    await ctx.render('session/new', {
      msg: 'El registro falló. Prueba utilizando otro nombre de usuario u otro correo.',
      submitLoginPath: ctx.router.url('session-create-login'),
      submitSignupPath: ctx.router.url('session-create-signup'),
    });
  }
});

router.delete('session-destroy', '/', async (ctx) => {
  const userkey = ctx.orm.UserKey.findOne( { where: { 'userId': ctx.session.currentUserId } } );
  await userkey.destroy();
  delete ctx.session.currentUserId;
  ctx.flashMessage.notice = 'Término de sesión exitoso';
  ctx.redirect('/');
});

module.exports = router;
