const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Movie = require('../app/controllers/movie');
const Comment = require('../app/controllers/comment');
const Category = require('../app/controllers/category');

module.exports = (router, app) => {
    //index page
    router.get('/',Index.index);
//    User
    router.post('/user/signup', User.signup);
    router.post('/user/signin', User.signin);
    router.get('/signin', User.showSignin);
    router.get('/signup', User.showSignup);
    router.get('/logout', User.logout);
    router.get('/admin/userlist', User.signinRequired, User.adminRequired, User.list);
// Movie
    router.get('/movie/:id', Movie.detail);
    router.get('/admin/new',User.signinRequired, User.adminRequired, Movie.new);
    router.get('/admin/update/:id',User.signinRequired, User.adminRequired, Movie.update);
    router.post('/admin/movie',User.signinRequired, User.adminRequired, Movie.save);
    router.get('/admin/list',User.signinRequired, User.adminRequired, Movie.list);
    router.del('/admin/list',User.signinRequired, User.adminRequired, Movie.del);
//    Comment
    router.post('/user/comment',User.signinRequired, Comment.save);
//    Category
    router.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
    router.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
    router.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
//    results
    router.get('/results', Index.search);
}