const Movie = require('../models/movie');
const Category = require('../models/category');

// index page
exports.index = async (ctx, next) => {
    let categories = await Category.find({})
        .populate({
            path: 'movies',
            select: 'title poster',
            options: { limit: 3 }
        })
        .exec();
    ctx.render('index', {
        title: 'movie 首页',
        categories
    });
};

// search page
exports.search = async (ctx, next) => {
    var categoryId = ctx.query.category;
    var q = ctx.query.q;
    var page = parseInt(ctx.query.page, 10) || 0;
    var count = 2;
    var index = page * count;

    if (categoryId) {
        try {
            let categories = await Category.find({_id: categoryId})
                .populate({
                    path: 'movies',
                    select: 'title poster'
                });
            let category = categories[0] || {};
            let movies = category.movies || [];
            let results = movies.slice(index, index + count);

            ctx.render('results', {
                title: 'imooc 结果列表页',
                keyword: category.name,
                currentPage: (page + 1),
                query: 'category=' + categoryId,
                totalPage: Math.ceil(movies.length / count),
                movies: results
            });
        } catch (e) {
            console.log(e);
        }
    }
    else {
        try {
            let movies = await Movie.find({title: new RegExp(q + '.*', 'i')});
            let result = movies.slice(index, index + count);

            ctx.render('results', {
                title: '结果列表页面',
                keyword: q,
                currentPage: (page + 1),
                query: 'q=' + q,
                totalPage: Math.ceil(movies.length / count),
                movies: result
            });
        }
        catch (e) {
            console.log(e);
        }
    }
}