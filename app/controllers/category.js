const Category = require('../models/category');

//admin new page
exports.new = async (ctx, next) =>  {
    ctx.render('category_admin', {
        title: '后台分类录入页',
        category: {}
    });
};

//admin post movie
exports.save = async (ctx, next) => {
    let _category = ctx.request.body.category;
    let category = new Category(_category);

    try {
        await category.save()
        ctx.redirect('/admin/category/list');
    } catch (err) {
        console.log(err);
    }
};

//category list
exports.list = async (ctx, next) => {
    try {
        let categories = await Category.fetch();
        ctx.render('categoryList', {
            title: '分类列表页',
            categories
        });
    } catch (err) {
        console.log(err);
    }
};