"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var comment_1 = require("../../models/comment");
var event_1 = require("../../models/event");
var user_1 = require("../../models/user");
var Promise = require("bluebird");
function destroy(req, res) {
    Promise.all([user_1.default.remove({}), event_1.default.remove({}), comment_1.default.remove({})])
        .then(function (resp) {
        res.status(200).json(resp);
    })
        .catch(function (err) {
        res.status(500).json(err);
    });
}
exports.default = { destroy: destroy };
