#!/usr/bin/env node

'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
var env = require("./app/env.js");
var md5 = require("md5");
var simpleGit = require('simple-git');
var utils = require("./app/utils.js");
var moment = require("moment");
var Decimal = require('decimal.js');
var bitcoin = require("bitcoin");
var serveIndex = require('serve-index')

var baseActionsRouter = require('./routes/baseActionsRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: env.cookiePassword,
	resave: false,
	saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/clients', serveIndex(path.join(__dirname, 'public', 'clients'), {'icons': true}))

// Make our db accessible to our router
app.use(function(req, res, next) {
	// make session available in templates
	res.locals.session = req.session;
	res.locals.debug = env.debug;

	if (env.bitcoind && env.bitcoind.rpc) {
		req.session.host = env.bitcoind.host;
		req.session.port = env.bitcoind.port;
		req.session.username = env.bitcoind.rpc.username;

		global.client = new bitcoin.Client({
			host: env.bitcoind.host,
			port: env.bitcoind.port,
			user: env.bitcoind.rpc.username,
			pass: env.bitcoind.rpc.password,
			timeout: 30000
		});
	}

	global.client.cmd('getinfo', function(err, result, resHeaders) {
		if (err) {
			return console.log("Error 3207fh0f: " + err);
		}

		res.locals.difficulty = result.difficulty;
		// add premine value
		res.locals.supply = ((result.blocks-2000)*50+2000*1000)+"";
		// pretty output
		res.locals.supply = res.locals.supply.split("").reverse().join("").match(/.{1,3}/g).join(",").split("").reverse().join("");
	});

	res.locals.host = req.session.host;
	res.locals.port = req.session.port;

	if (!["/", "/connect"].includes(req.originalUrl)) {
		if (utils.redirectToConnectPageIfNeeded(req, res)) {
			return;
		}
	}

	if (req.session.userMessage) {
		res.locals.userMessage = req.session.userMessage;

		if (req.session.userMessageType) {
			res.locals.userMessageType = req.session.userMessageType;

		} else {
			res.locals.userMessageType = "info";
		}
	}

	req.session.userMessage = null;
	req.session.userMessageType = null;

	// make some var available to all request
	// ex: req.cheeseStr = "cheese";

	next();
});

app.use('/', baseActionsRouter);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

app.locals.moment = moment;
app.locals.Decimal = Decimal;
app.locals.utils = utils;



module.exports = app;
