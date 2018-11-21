const Sequelize = require('sequelize');
const KoaRouter = require('koa-router');
const router = new KoaRouter();
const queryEngine = require('../lib/queryEngine.js');

const API_URL = 'http://charette11.ing.puc.cl';

router.get('session-new', '/', async (ctx) => {
  await ctx.render('session/new',
            {
              notice: ctx.flashMessage.notice,
              submitSignupPath: ctx.router.url('session-signup'),
              submitLoginPath: ctx.router.url('session-create'),
            },)
});

router.post('session-create', '/', async (ctx) => {
  const { username, email, password } = ctx.request.body;
  const [response, response2] = await queryEngine.loginAPI(API_URL, username, email, password);
  const user = response.user;
  console.log('response2:', response2);
  if (response.status_code === 201) {
    try {
      ctx.session.currentTokenOtherAPI = response2.token;
      console.log('ctx.session.currentTokenOtherAPI:', ctx.session.currentTokenOtherAPI);

      const userkey = await ctx.orm.userKey.build({
        'userId': user.id,
        'token': user.oauth_token,
      })
      await userkey.save();
      ctx.session.currentUsername = user.username;
      ctx.session.currentUserId = user.id;
      ctx.session.currentToken = user.oauth_token; //test

      ctx.flashMessage.notice = 'Inicio de sesión exitoso';
      // console.log('[i] User logged in');
      // console.log(ctx.router.url('index'));
      await ctx.redirect(ctx.router.url('index')[0]);
    } catch (validationError) {
      ctx.session.currentTokenOtherAPI = response2.token;
      console.log('ctx.session.currentTokenOtherAPI:', ctx.session.currentTokenOtherAPI);


      ctx.session.currentToken = user.oauth_token; //test
      ctx.session.currentUsername = user.username;
      ctx.session.currentUserId = user.id;

	console.log('[i] User logged in');
      console.log(ctx.router.url('index'));
      await ctx.redirect(ctx.router.url('index')[0]);
    }
  } else {
    ctx.flashMessage.notice = 'Error en las credenciales de inicio';
    await ctx.redirect(ctx.router.url('session-new'));
  }
});

router.post('session-signup', '/signup', async (ctx) => {
  const { username, first_name, last_name, email, password } = ctx.request.body;
  try{
    console.log(username);
    const response = await queryEngine.signUpAPI(API_URL, username, first_name, last_name, email, password);
    console.log(response);
    if (response.status_code === 201) {
      ctx.flashMessage.notice = "Ahora puedes hcer login con tus datos";
    } else {
      ctx.flashMessage.notice = "Su cuenta no pudo ser creada";
    }
  } catch (e) {
    let a = 0;
  }
  await ctx.redirect(ctx.router.url('session-new'));
});

router.delete('session-destroy', '/', async (ctx) => {
  ctx.orm.userKey.findOne( { where: { 'userId': ctx.session.currentUserId } }
  ).then(function(userkey){userkey.destroy()});
  delete ctx.session.currentUserId;
  ctx.flashMessage.notice = 'Término de sesión exitoso';
  ctx.redirect('/');
});

module.exports = router;
