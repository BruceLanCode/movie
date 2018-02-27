const Movie = require('../models/movie');
const Comment = require('../models/comment');
const Category = require('../models/category');
const fs = require('fs');
const path = require('path');
const Promise = require("bluebird");
const readFile = Promise.promisify(require("fs").readFile);
const writeFile = Promise.promisify(require("fs").writeFile);

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
    let categories = await Category.fetch();
    ctx.render('admin', {
        title: 'movie 后台录入页',
        categories,
        movie: {}
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

// admin poster
exports.savePoster = async (ctx, next) => {
    var posterData = ctx.request.body.files.uploadPoster;
    var filePath = posterData.path;
    var originalFilename = posterData.name;

    if(originalFilename) {
        try {
            let data = await readFile(filePath);
            let timestamp = Date.now();
            let type = posterData.type.split('/')[1];
            let poster = timestamp + '.' + type;
            let newPath = path.join(__dirname,  '../../', '/public/upload/' + poster);

            await writeFile(newPath, data)
            ctx.poster = poster;
        } catch(e) {
            console.log(e);
        }
    }
    await next();
}

//admin post movie
exports.save = async (ctx, next) => {
    let movieObj = ctx.request.body.fields;
    let id = movieObj._id;
    let _movie;

    if(ctx.poster) {
        movieObj.poster = ctx.poster;
    }

    if(id) {
        try {
            let movie = await Movie.findById(id);
            _movie = Object.assign(movie, movieObj);
            await _movie.save();
            if (movieObj.category) {
                let categoryExit = false;
                let category = await Category.findById(movieObj.category);
                category.movies.forEach((movieInCategory) => {
                    if (movieInCategory.toString() === movie._id.toString()) {
                        categoryExit = true;
                    }
                });
                if(!categoryExit) {
                    category.movies.push(movie._id);
                }
                await category.save();
            }
            ctx.redirect('/movie/' + movie._id);
        } catch (err) {
            console.log(err);
        }
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
        let movies = await Movie.find({})
            .populate('category', 'name')
            .exec();
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