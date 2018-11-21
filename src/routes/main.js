const KoaRouter = require('koa-router');
const queryEngine  = require('../lib/queryEngine.js');

const router = new KoaRouter();

const API_URL = 'http://charette11.ing.puc.cl';

router.get('index','/', async (ctx) => {
  console.log(ctx.session);
  if (ctx.session.currentUserId === undefined) {
    ctx.flashMessage.notice = 'Debes hacer login o registrarte para entrar';
    await ctx.redirect(ctx.router.url('session-new'));
  }
  else {
    console.log("logged user")
    let result = await ctx.orm.userKey.findOne({ where: {userId: ctx.session.currentUserId.toString()}})
    let token = result.token
    const headers = {"Oauth-token":token};
    const response = await queryEngine.fetchMembership(API_URL, headers);
    let myGroups = [];
    console.log(response['groups']);
    if(response['status_text'] !== undefined){
        myGroups = [];
    } else {
    	for(var i = 0; i < response['groups'].length; i++)
	{
		let elem = response['groups'][i];
		let grp = await queryEngine.fetchGroup(API_URL, headers, elem, ctx.session.currentTokenOtherAPI);
		myGroups.push(grp);
	}
    }
    await ctx.render('index',
	{
                groups: myGroups,
		destroySessionPath: ctx.router.url('session-destroy'),
		currentUser: ctx.session.currentUsername,
	}
    );
  }
});

module.exports = router;
