const User = require('../models/user');

//signup
exports.showSignup = async (ctx, next) => {
    ctx.render('signup', {
        title: '注册页面'
    });
};

exports.showSignin = async (ctx, next) => {
    ctx.render('signin', {
        title: '登录页面'
    });
};

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

// middleware for user
exports.signinRequired = async (ctx, next) => {
    let user = ctx.state.user;

    if(!user) {
        return ctx.redirect('/signin');
    }

    await next();
}

exports.adminRequired = async (ctx, next) => {
    let user = ctx.state.user;
    if (!user.role || user.role <= 10) {
        return ctx.redirect('/signin');
    }

    await next();
}