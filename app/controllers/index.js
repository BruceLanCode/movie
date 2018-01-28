const Movie = require('../models/movie');

exports.index = async (ctx, next) => {
    let movies = await Movie.fetch();
    ctx.render('index', {
        title: 'movie 首页',
        movies: movies
    });
};