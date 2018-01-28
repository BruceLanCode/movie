const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Movie = require('../app/controllers/movie');

module.exports = (router, app) => {
    //index page
    router.get('/',Index.index);
//    signup
    router.post('/user/signup', User.signup);
//    signin
    router.post('/user/signin', User.signin)
//    logout
    router.get('/logout', User.logout);
//    userlist page
    router.get('/admin/userlist', User.list);
//detail page
    router.get('/movie/:id', Movie.detail);
//admin new page
    router.get('/admin/new', Movie.new);
//admin update page
    router.get('/admin/update/:id', Movie.update);
//admin post movie
    router.post('/admin/movie', Movie.save);
//list page
    router.get('/admin/list', Movie.list);
//delete item
    router.del('/admin/list', Movie.del);
}