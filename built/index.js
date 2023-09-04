"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var http = require("http");
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var Promise = require("bluebird");
var mongoose = require("mongoose");
var routes_1 = require("./routes");
var config;
if (process.env.NODE_ENV === 'test') {
    config = require('./test-config.json');
}
else if (process.env.NODE_ENV === 'development') {
    config = require('./dev-config.json');
}
var app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '100kb' }));
app.use(bodyParser.urlencoded({ extended: true }));
var options = {
    useMongoClient: true,
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
};
var DATABASE = process.env.MONGODB_URI || config.db;
mongoose.Promise = Promise;
mongoose.connect(DATABASE, options);
app.get('/', function (req, res) {
    res.send('Hello, world!');
});
app.use('/api', routes_1.default);
app.set('port', process.env.PORT || config.port);
http.createServer(app).listen(app.get('port'), '0.0.0.0');
console.log("Ready on port " + app.get('port'));
console.log("Ready on DB " + DATABASE);
exports.default = app;
