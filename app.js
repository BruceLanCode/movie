const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
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
//index page
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
//detail page
router.get('/movie/:id',async (ctx, next) => {
    await Movie.findById(ctx.params.id, function (err, movie) {
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
//admin page
router.get('/admin/new/:id', async (ctx, next) => {
    let id = ctx.params.id;
    if (id) {
        await Movie.findById(id, (err, movie) => {
            if(err) {
                console.log(err);
            }
            ctx.render('admin', {
                title: 'movie 后台修改' + movie.title,
                movie: movie
            });
        });
    }
    else {
        await ctx.render('admin', {
            title: 'movie 后台录入页',
            movie: {}
        })
    }
    await next();
})

router.post('/admin/movie', koaBody(), async (ctx, next) => {
    let _movie = ctx.request.body.movie;
    if(!_movie._id) {
        _movie = new Movie({
            director: ctx.request.body.director,
            title: ctx.request.body.title,
            language: ctx.request.body.language,
            country: ctx.request.body.country,
            year: ctx.request.body.year,
            poster: ctx.request.body.poster,
            flash: ctx.request.body.flash,
            summary: ctx.request.body.summary,
        });

        await _movie.save((err, movie) => {
            if(err) {
                console.log(err)
            }

            ctx.redirect('/movie/' + movie._id);
        })
    }
    else {
        await Movie.findById(_movie._id, async (err, movie) => {
            if(err) {
                console.log(err);
            }
            _movie = Object.assign(movie, _movie);
            await _movie.save((err, movie) => {
                if(err) {
                    console.log(err);
                }

                ctx.redirect('/movie/' + movie._id);
            })
        })
    }
    await next();
});

app.use(router.routes());
app.use(staticServer(path.join(__dirname,'public')));

console.info('Server started port 3000');