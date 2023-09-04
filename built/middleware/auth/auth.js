"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var Promise = require("bluebird");
var config;
if (process.env.NODE_ENV === 'test') {
    config = require('../../test-config.json');
}
else if (process.env.NODE_ENV === 'development') {
    config = require('../../dev-config.json');
}
var SECRET = process.env.SESSION_SECRET || config.secret;
var isAuthenticated = function (req, res, next) {
    var token = req.get('Authorization');
    return new Promise(function (resolve, reject) {
        if (token) {
            jwt.verify(token, SECRET, function (err, decoded) {
                if (err) {
                    return reject(res.status(403).json({ message: err.message }));
                }
                if (decoded) {
                    req.decoded = decoded;
                    return resolve(next());
                }
            });
        }
        else {
            return res.status(403).json({ message: 'No token provided!' });
        }
    });
};
exports.default = { isAuthenticated: isAuthenticated };
