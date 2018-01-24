const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

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

    let salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    let hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;

    next();
});

UserSchema.methods = {
    comparePassword: function(_password) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, this.password, (err, same) => {
                if(err) {
                    console.log(err);
                }
                resolve(same);
            })
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