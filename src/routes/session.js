/* eslint camelcase: "off" */
const Sequelize = require('sequelize');
const KoaRouter = require('koa-router');

const router = new KoaRouter();
const queryEngine = require('../lib/queryEngine.js');

const API_URL = 'http://charette11.ing.puc.cl';

router.get('session-new', '/', async (ctx) => {
  ctx.session.tokenOtherAPI = await queryEngine.authOtherAPI();
  await ctx.render(
    'session/new',
    {
      notice: ctx.flashMessage.notice,
      submitSignupPath: ctx.router.url('session-signup'),
      submitLoginPath: ctx.router.url('session-create'),
    },
  );
  delete ctx.flashMessage.notice;
});

router.post('session-create', '/', async (ctx) => {
  console.log('LOGIN DATA RECEIVED: \n', ctx.request.body);
  const { username, email, password } = ctx.request.body;
  const [response, response2] = await queryEngine.loginAPI(API_URL, username, email, password, ctx.session.tokenOtherAPI);
  const { user } = response;
  console.log('RESPONSE LOGIN API1:', response);
  console.log('RESPONSE LOGIN API2:', response2);
  if (response.status_code === 201 && response2.userId) {
    try {
      ctx.session.currentUsername = user.username;
      ctx.session.currentUserId = user.id;
      ctx.session.currentUserMail = email;
      ctx.session.currentUserIdOtherAPI = response2.userId;
      ctx.session.currentUserTokenOtherAPI = response2.id;
      ctx.session.currentUserToken = user.oauth_token;
      ctx.flashMessage.notice = 'Inicio de sesión exitoso';
      await ctx.redirect(ctx.router.url('index')[0]);
    } catch (error) {
      console.log(error);
      await ctx.redirect(ctx.router.url('session-new'));
    }
  } else {
    ctx.flashMessage.notice = 'Error en las credenciales de inicio';
    await ctx.redirect(ctx.router.url('session-new'));
  }
});

router.post('session-signup', '/signup', async (ctx) => {
  // console.log('SIGNUP INFO RECEIVED FROM VIEW:\n', ctx.request.body);
  const {
    username, first_name, last_name, email, password,
  } = ctx.request.body;
  try {
    const response = await queryEngine.signUpAPI(API_URL, username, first_name, last_name, email, password, ctx.session.tokenOtherAPI);
    // console.log('Response API1:\n', response[0]);
    // console.log('\nResponse API2:\n', response[1]);
    if (response[0].status_code === 201 && response[1].id) {
      ctx.flashMessage.notice = 'Su cuenta fue registrada exitosamente';
    } else {
      ctx.flashMessage.notice = 'No se pudo hacer registro de su cuenta';
    }
  } catch (e) {
    console.log(e);
  }
  await ctx.redirect(ctx.router.url('session-new'));
});

router.delete('session-destroy', '/', async (ctx) => {
  delete ctx.session.currentUserId;
  delete ctx.session.currentUsername;
  delete ctx.session.currentUserId;
  delete ctx.session.currentUserIdOtherAPI;
  delete ctx.session.currentToken;
  delete ctx.session.currentTokenOtherAPI;
  ctx.flashMessage.notice = 'Término de sesión exitoso';
  ctx.redirect('/');
});

module.exports = router;
