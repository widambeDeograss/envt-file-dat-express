"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var recommendations_1 = require("../../controllers/recommendations");
var auth_1 = require("../../middleware/auth");
var router = express.Router();
router.route('/:id')
    .get(auth_1.default.isAuthenticated, recommendations_1.default.get);
exports.default = router;
