const Movie = require('../models/movie');
const Category = require('../models/category');

exports.index = async (ctx, next) => {
    let categories = await Category.find({})
        .populate({
            path: 'movies',
            select: 'title poster',
            options: { limit: 6 }
        })
        .exec();
    ctx.render('index', {
        title: 'movie 首页',
        categories
    });
};