const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const Pug = require('koa-pug');
const staticServer = require('koa-static');
const moment = require('moment');
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
    let id = ctx.params.id;

    await Movie.findById(id, function (err, movie) {
        if(err !== null) {
            console.log(err);
        }
        ctx.render('detail',{
            title: `movie 详情页`,
            movie: movie
        });
    });
    await next();
});
//admin new page
router.get('/admin/new', async (ctx, next) => {
    ctx.render('admin', {
        title: 'movie 后台录入页',
        movie: {
            title: '',
            director: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: '',
        }
    });
    await next();
})

//admin update page
router.get('/admin/update/:id', async (ctx, next) => {
    let id = ctx.params.id;
    if (id) {
        await Movie.findById(id, (err, movie) => {
            ctx.render('admin', {
                title: 'movie 后台更新页',
                movie: movie
            });
        });
    }
    await next();
})
//admin post movie
router.post('/admin/movie', koaBody(), async (ctx, next) => {
    let movieObj = ctx.request.body.movie;
    let id = ctx.request.body.movie._id;
    let _movie;
    if(id !== 'undefined') {
        await Movie.findById(id, async (err, movie) => {
            if(err) {
                console.log(err);
            }
            _movie = Object.assign(movie, movieObj);
            await _movie.save((err, movie) => {
                if(err) {
                    console.log(err);
                }

                ctx.redirect('/movie/' + movie._id);
            })
        })
    }
    else {
        _movie = new Movie({
            director: movieObj.director,
            title: movieObj.title,
            language: movieObj.language,
            country: movieObj.country,
            year: movieObj.year,
            poster: movieObj.poster,
            flash: movieObj.flash,
            summary: movieObj.summary,
        });

        await _movie.save((err, movie) => {
            if(err) {
                console.log(err)
            }

            ctx.redirect('/movie/' + movie._id);
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
        movies.forEach(movie => {
            movie.meta.updateAt = moment(movie.meta.updateAt).format('MM/DD/YYYY');
        });
        ctx.render('list', {
            title: 'movie 列表页',
            results: movies
        })
    });
    await next()
});
//delete item
router.del('/admin/list', async (ctx, next) => {
    let id = ctx.query.id;

    if(id) {
        await Movie.remove({_id: id}, (err, movie) => {
            if(err) {
                console.log(err);
                ctx.body = {success: 0};
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