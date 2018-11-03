const KoaRouter = require('koa-router');
const router = new KoaRouter();

router.get('users', '/', async (ctx) => {
  console.log("xd")
  await ctx.render('users/index', {
    notice: ctx.flashMessage.notice,
  });
});

router.post('userscreate', '/', async (ctx) => {
    const user = ctx.orm.User.build(ctx.request.body);
    user.userName = ctx.request.body.fields.userName;
    user.password = ctx.request.body.fields.password;
    user.email = ctx.request.body.fields.email;
    try {
      await user.save({ fields: ['userName', 'password', 'email'] });
      ctx.flashMessage.notice = 'Usuario creado con exito';
      ctx.session.userId = user.id;
      //return ctx.redirect(ctx.router.url('profile'));
      // await ctx.render('users/profile', {
      //   message: 'Usuario creado con exito!',
      // });
    } catch (validationError) {
      ctx.flashMessage.notice = 'Error';
    }
  });