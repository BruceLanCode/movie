const Koa = require('koa');
const Router = require('koa-router');
const Pug = require('koa-pug');
const path = require('path');
const port = process.env.PORT || 3000;

const app = new Koa();
const pug = new Pug({
    viewPath: 'views',
    app
});

app.listen(port);

const router = new Router();
router.get('/huang',async (ctx, next) => {
    ctx.render('layout',{title: 'huang'});
    next();
});
router.get('/xi',async (ctx, next) => {
    ctx.render('layout',{title: 'xi'});
    next();
});

app.use(router.routes());

console.info('Server started port 3000');