"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Promise = require("bluebird");
var diet_preference_1 = require("../diet-preference");
var uniqueValidator = require('mongoose-unique-validator');
var UserSchema = new mongoose.Schema({
    username: { type: String, index: { unique: true } },
    password: { type: String, minlength: 5, select: false },
    dietPreferences: [{ type: String, enum: diet_preference_1.default }]
}, { usePushEach: true });
UserSchema.plugin(uniqueValidator);
UserSchema.pre('save', function (next) {
    var _this = this;
    if (!this.isModified('password')) {
        return next();
    }
    bcrypt.hash(this.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        _this.password = hash;
        next();
    });
});
UserSchema.methods.comparePassword = function (password) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        bcrypt.compare(password, _this.password, function (err, res) {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        });
    });
};
UserSchema.post('save', function (err, doc, next) {
    var dietaryError = dietaryErrorExists(err);
    if (err.name === 'ValidationError' && !dietaryError && !err.errors.username) {
        next(new Error('User validation failed'));
    }
    else if (err.name === 'ValidationError' && err.errors.username && err.errors.username.kind === 'unique') {
        next(new Error('This user already exists!'));
    }
    else if (dietaryError) {
        next(new Error('Diet preferences are invalid!'));
    }
    else {
        next(err);
    }
});
function dietaryErrorExists(err) {
    for (var prop in err.errors) {
        if (prop.indexOf('dietPreferences') >= 0) {
            return true;
        }
        return false;
    }
}
exports.default = mongoose.model('User', UserSchema);
