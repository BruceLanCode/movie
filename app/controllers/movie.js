const Movie = require('../models/movie');
const Comment = require('../models/comment');
const Category = require('../models/category');

//detail page
exports.detail = async (ctx, next) => {
    let id = ctx.params.id;
    try {
        let movie = await Movie.findById(id);
        let comments = await Comment.find({movie: id})
            .populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec();
        ctx.render('detail', {
            title: 'movie 详情页',
            movie,
            comments
        });
    } catch (err) {
        console.log(err);
    }
};

//admin new page
exports.new = async (ctx, next) => {
    let categorries = await Category.fetch();
    ctx.render('admin', {
        title: 'movie 后台录入页',
        categorries,
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
};

//admin update page
exports.update = async (ctx, next) => {
    let id = ctx.params.id;
    let movie, categories;
    if (id) {
        try {
            movie = await Movie.findById(id);
            categories = await Category.fetch();
            ctx.render('admin', {
                title: 'movie 后台更新页',
                categories,
                movie
            });
        } catch (err) {
            console.log(err);
        }
    }
};

//admin post movie
exports.save = async (ctx, next) => {
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
            category: movieObj.category,
            categoryName: movieObj.categoryName
        });
        let categoryId = movieObj.category;
        let categoryName = movieObj.categoryName;

        try {
            let movie = await _movie.save();
            if (categoryId) {
                let category = await Category.findById(categoryId);
                category.movies.push(movie._id);
                await category.save();
            }
            else if (categoryName) {
                let category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                });
                let _category = await category.save();
                movie.category = _category._id;
                await movie.save();
            }
            ctx.redirect('/movie/' + movie._id);
        } catch(err) {
            console.log(err);
        }
    }
};

// list page
exports.list = async (ctx, next) => {
    try {
        let movies = await Movie.fetch();
        ctx.render('list', {
            title: 'movie 列表页',
            results: movies
        });
    } catch (err) {
        console.log('list err: ' + err);
    }

};

// delete item
exports.del = async (ctx, next) => {
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
};