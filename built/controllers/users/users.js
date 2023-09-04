"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("../../models/user");
function get(req, res) {
    user_1.default.findOne({ username: req.params.username })
        .exec()
        .then(function (user) {
        if (!user) {
            res.status(404).json({ resource: 'users', message: 'User does not exist!' });
        }
        else {
            res.status(200).json(user);
        }
    })
        .catch(function (err) {
        res.status(500).json(err);
    });
}
function create(req, res) {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ message: 'Please provide a username and password.' });
    }
    else {
        var user = new user_1.default({
            username: req.body.username,
            password: req.body.password,
            dietPreferences: req.body.dietPreferences
        });
        user.save()
            .then(function (user) {
            res.status(200).json(user);
        })
            .catch(function (err) {
            if (err.message === 'User validation failed') {
                res.status(400).json({ message: 'Your password must be at least 5 characters long.' });
            }
            else if (err.message === 'This user already exists!') {
                res.status(400).json({ message: 'This user already exists.' });
            }
            else if (err.message === 'Diet preferences are invalid!') {
                res.status(400).json({ message: 'Diet preferences are invalid.' });
            }
            else {
                res.status(500).json(err);
            }
        });
    }
}
exports.default = { get: get, create: create };
