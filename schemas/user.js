const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

UserSchema.pre('save', function(next) {
    const user = this;

    if(user.isNew) {
        user.meta.createAt = user.meta.updateAt = Date.now();
    }
    else {
        user.meta.updateAt = Date.now();
    }

    next();
});

UserSchema.methods = {
    comparePassword: function(_password) {
        return new Promise((resolve, reject) => {
            if (this.password === _password) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    }
}

UserSchema.statics = {
    fetch: function() {
        return this.find({})
            .sort('meta.updateAt')
            .exec()
    },
    findById: function(id) {
        return this.findOne({_id: id})
            .exec()
    }
}

module.exports = UserSchema;