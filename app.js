const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const Pug = require('koa-pug');
const staticServer = require('koa-static');
const moment = require('moment');
const path = require('path');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const session = require('koa-session');
const MongooseStore = require('koa-session-mongoose');

const app = new Koa();
const pug = new Pug({
    viewPath: 'views/pages',
    app
});

mongoose.connect('mongodb://localhost:4000/movie', (err) => {
    if(err) {
        console.log(err);
        return;
    }
    app.use(session({
        key: 'JSESSIONID',
        // store: new MongooseStore({
        //     collection: 'sessions',
        //     name: 'Session'
        // })
    }, app))
});

app.listen(port);

const router = new Router();
require('./config/routes')(router, app);

// app.locals = {};
app.use(async (ctx, next) => {
    ctx.state.moment = moment;
    // if (app.locals) {
    //     ctx.state = Object.assign({},ctx.state,app.locals);
    // }
    console.log('init',ctx.session)
    let _user = ctx.session.user;
    if(_user) {
        ctx.state.user = _user;
    }
    await next();
});
app.use(koaBody());
app.use(staticServer(path.join(__dirname,'public')));
app.use(router.routes());

console.info('Server started port 3000');