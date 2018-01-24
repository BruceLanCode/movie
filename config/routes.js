const Movie = require('../models/movie');
const User = require('../models/user');

module.exports = (router, app) => {
    //index page
    router.get('/',async (ctx, next) => {
        let movies = await Movie.fetch();
        ctx.render('index', {
            title: 'movie 首页',
            movies: movies
        });
    });

//    signup
    router.post('/user/signup', async (ctx, next) => {
        let _user = ctx.request.body.user;

        try {
            let user = await User.find({ name: _user.name });
            if (user.length) {
                ctx.redirect('/');
            }
            else {
                let newUser = new User(_user);
                user = await newUser.save();
                ctx.redirect('/admin/userlist');
            }
        } catch (err) {
            console.log(err);
        }
    });

//    signin
    router.post('/user/signin', async (ctx, next) => {
        let _user = ctx.request.body.user;
        let name = _user.name;
        let password = _user.password;

        try {
            let user = await User.findOne({ name });
            if (!user) {
                return ctx.redirect('/')
            }

            let isMatch = await user.comparePassword(password);
            if (isMatch) {
                // app.locals.user = user;
                ctx.session.user = user;
                console.log('sign in',ctx.session)
                return ctx.redirect('/');
            }
            else {
                console.log('Password is not matched');
            }
        } catch (err) {
            console.log(err);
        }
    })

//    logout
    router.get('/logout', (ctx, next) => {
        ctx.redirect('/');
    });

//    userlist page
    router.get('/admin/userlist', async (ctx, next) => {
        try {
            let users = await User.fetch();
            ctx.render('userlist', {
                title: 'movie 用户列表页',
                users
            });
        } catch (err) {
            console.log(err);
        }
    });

//detail page
    router.get('/movie/:id',async (ctx, next) => {
        let id = ctx.params.id;
        let movie = await Movie.findById(id);
        ctx.render('detail', {
            title: 'movie 详情页',
            movie,
        });
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
    });

//admin update page
    router.get('/admin/update/:id', async (ctx, next) => {
        let id = ctx.params.id;
        let movie;
        if (id) {
            movie = await Movie.findById(id);
            ctx.render('admin', {
                title: 'movie 后台更新页',
                movie
            });
        }
    });
//admin post movie
    router.post('/admin/movie', async (ctx, next) => {
        let movieObj = ctx.request.body.movie;
        let id = ctx.request.body.movie._id;
        let _movie;
        if(id) {
            let movie = await Movie.findById(id);
            _movie = Object.assign(movie, movieObj);
            await _movie.save();
            ctx.redirect('/movie/' + movie._id);
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

            let movie = await _movie.save();
            ctx.redirect('/movie/' + movie._id);
        }
    });

//list page
    router.get('/admin/list', async (ctx, next) => {
        try {
            let movies = await Movie.fetch();
            ctx.render('list', {
                title: 'movie 列表页',
                results: movies
            });
        } catch (err) {
            console.log('list err: ' + err);
        }

    });
//delete item
    router.del('/admin/list', async (ctx, next) => {
        let id = ctx.query.id;
        let movie;
        if(id) {
            try {
                await Movie.remove({_id: id});
                ctx.body = {success: 1};
            } catch(err) {
                console.log(err);
                ctx.body = {success: 0};
            }
        }
    });
}