"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var test_1 = require("../../controllers/test");
var router = express.Router();
router.route('/')
    .delete(test_1.default.destroy);
exports.default = router;
