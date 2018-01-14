const Koa = require('koa');
const Router = require('koa-router');
const Pug = require('koa-pug');
const staticServer = require('koa-static');
const path = require('path');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const Movie = require('./models/movie');

mongoose.connect('mongodb://localhost:4000/movie');

const app = new Koa();
const pug = new Pug({
    viewPath: 'views/pages',
    app
});

app.listen(port);

const router = new Router();
router.get('/',async (ctx, next) => {
    await Movie.fetch(function (err, movies) {
        if(err !== null) {
            console.log(err);
        }

        ctx.render('index',{
            title: 'movie 首页',
            movies: movies
        });
    });
    await next();
});
router.get('/movie/:id',async (ctx, next) => {
    await Movie.findById(ctx.query.id, function (err, movie) {
        if(err !== null) {
            console.log(err);
        }

        ctx.render('detail',{
            title: `movie 《${movie.title}》`,
            movie: movie
        });
    });
    await next();
});
router.get('/admin',async (ctx, next) => {
    await ctx.render('admin',{
        title: '后台录入页'
    });
    await next();
});

app.use(router.routes());
app.use(staticServer(path.join(__dirname,'public')));

console.info('Server started port 3000');