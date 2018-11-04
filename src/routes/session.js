const KoaRouter = require('koa-router');
const router = new KoaRouter();
const queryEngine = require('../lib/queryEngine.js');

const API_URL = 'http://charette11.ing.puc.cl';

router.get('session-new', '/', async (ctx) => {
  console.log("before");
  await ctx.render('session/new',
            {
              notice: ctx.flashMessage.notice,
              submitSignupPath: ctx.router.url('session-signup'),
              submitLoginPath: ctx.router.url('session-create'),
            },)
});

router.post('session-create', '/', async (ctx) => {
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
    return ctx.redirect(ctx.router.url('main'));
  } else {
    ctx.flashMessage.notice = 'Error en las credenciales de inicio';
    await ctx.redirect(ctx.router.url('session-new'));
  }
});

router.post('session-signup', '/signup', async (ctx) => {
  const { username, first_name, last_name, email, password } = ctx.request.body;
  const response = await queryEngine.signUpAPI(API_URL, username, first_name, last_name, email, password);

  if (response.status_code === 201) {
    ctx.flashMessage.notice = "Ahora puedes hcer login con tus datos";
  } else {
    ctx.flashMessage.notice = "Su cuenta no pudo ser creada";
  }
  await ctx.redirect(ctx.router.url('session-new'));
});

router.delete('session-destroy', '/', async (ctx) => {
  ctx.orm.UserKey.findOne( { where: { 'userId': ctx.session.currentUserId } }
  ).then(function(userkey){userkey.destroy()});
  delete ctx.session.currentUserId;
  ctx.flashMessage.notice = 'Término de sesión exitoso';
  ctx.redirect('/');
});

module.exports = router;
