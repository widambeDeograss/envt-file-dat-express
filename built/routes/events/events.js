"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var events_1 = require("../../controllers/events");
var auth_1 = require("../../middleware/auth");
var router = express.Router();
router.route('/')
    .get(events_1.default.all)
    .post(auth_1.default.isAuthenticated, events_1.default.create);
router.route('/:id')
    .get(events_1.default.get)
    .patch(auth_1.default.isAuthenticated, events_1.default.update);
router.route('/user/:id')
    .get(events_1.default.getEventsForUser);
router.route('/:id/subscribe')
    .patch(auth_1.default.isAuthenticated, events_1.default.subscribe);
exports.default = router;
