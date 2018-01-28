const User = require('../models/user');

//signup
exports.signup = async (ctx, next) => {
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
};

//signin
exports.signin = async (ctx, next) => {
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
            ctx.session.user = user;
            return ctx.redirect('/');
        }
        else {
            console.log('Password is not matched');
        }
    } catch (err) {
        console.log(err);
    }
};

//logout
exports.logout = (ctx, next) => {
    delete ctx.session.user;
    ctx.redirect('/');
};

//userlist page
exports.list = async (ctx, next) => {
    try {
        let users = await User.fetch();
        ctx.render('userlist', {
            title: 'movie 用户列表页',
            users
        });
    } catch (err) {
        console.log(err);
    }
};