var mongoose = require('mongoose');
//require('./Model');
//
//var dbURI = 'mongodb://localhost:27017/lumarhome_test';
//mongoose.connect(dbURI);
//
////Monitor the DB connections
//mongoose.connection.on('connected', function() {
//	console.log("Mongoose connected to " + dbURI);
//});
//
//mongoose.connection.on('error', function(err) {
//	console.log("Mongoose connection error " + err);
//});
//
//mongoose.connection.on('disconnected', function() {
//	console.log("Mongoose disconnected from " + dbURI);
//});
//
//// Listeners for the signals that occur when application is killed
//// then close down the DB connection
//process.once('SIGUSR2', function() {
//	gracefulDbShutdown('nodemon restart',function () {
//		process.kill(process.pid, 'SIGUSR2');
//	});
//});
//
//process.on('SIGINT', function() {
//	gracefulDbShutdown('app termination',function () {
//		process.exit(0);
//	});
//});
//
//process.on('SIGTERM', function() {
//	gracefulDbShutdown('Heroku app shutdown',function () {
//		process.exit(0);
//	});
//});
//
//
//var gracefulDbShutdown = function(msg, callback) {
//	mongoose.connection.close(function() {
//		console.log("Mongoose disconnected through " + msg);
//		callback();
//	});
//};