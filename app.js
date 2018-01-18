const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const Pug = require('koa-pug');
const staticServer = require('koa-static');
const moment = require('moment');
const path = require('path');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:4000/movie');

const app = new Koa();
const pug = new Pug({
    viewPath: 'views/pages',
    app
});

app.listen(port);

const router = new Router();
require('./config/routes')(router);

app.use(async (ctx, next) => {
    ctx.state.moment = moment;
    await next();
});
app.use(koaBody());
app.use(staticServer(path.join(__dirname,'public')));
app.use(router.routes());

console.info('Server started port 3000');