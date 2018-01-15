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
router.get('/admin/new/:id?', async (ctx, next) => {
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
            director: ctx.request.body.movie.director,
            title: ctx.request.body.movie.title,
            language: ctx.request.body.movie.language,
            country: ctx.request.body.movie.country,
            year: ctx.request.body.movie.year,
            poster: ctx.request.body.movie.poster,
            flash: ctx.request.body.movie.flash,
            summary: ctx.request.body.movie.summary,
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
//list page
router.get('/admin/list', async (ctx, next) => {
    await Movie.fetch((err, movies) => {
        if(err) {
            console.log(err)
        }

        ctx.render('list', {
            title: 'movie列表页',
            documents: {
                results: movies
            }
        })
    });
    await next()
});
//delete item
router.del('/admin/list', async (ctx, next) => {
    let id = ctx.query.id;

    if(id) {
        await Movie.remove({_id: id}, (err, home) => {
            if(err) {
                console.log(err);
            }
            else {
                ctx.body = {success: 1};
            }
        })
    }
    await next()
})

app.use(router.routes());
app.use(staticServer(path.join(__dirname,'public')));

console.info('Server started port 3000');