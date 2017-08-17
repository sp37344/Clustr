var promise = require('bluebird');

var options = {
	// Initialization options
	promiseLib: promise
}

// For testing
var localhost = 'http://192.168.42.154';

var pgp = require('pg-promise')(options);
var db = pgp({
	host: 'localhost',
	// host: '192.168.42.154',
	port: 5432,
	database: 'clustr',
	user: 'postgres',
	password: 'c1ustR!17'
});

// QUERY FUNCTIONS

// Get all users
function getAllUsers(req, res, next) {
	db.any('SELECT * FROM users').then(function(data) {
		res.status(200).json({
			status: 'success',
			data: data,
			message: 'Retrived ALL users'
		})
	}).catch(function(err) {
		return next(err);
	});
};

// Get the user corresponding to a Clustr id
function getUser(req, res, next) {
	db.one('SELECT * FROM users WHERE id = $1', parseInt(req.params.id)).then(function(data) {
		res.status(200).json({
			status: 'success',
			data: data,
			message: 'Retrieved ONE user'
		});
	}).catch(function(err) {
		return next(err);
	});
};

// Update a single user's status
function updateStatus(req, res, next) {
	db.none('UPDATE users SET status=$1 WHERE id=$2', [req.body.status, parseInt(req.params.id)]).then(function() {
		res.status(200).json({
			status: 'success',
			message: 'Updated the status of the user'
		});
	}).catch(function(err) {
		return next(err);
	});
};

// Update the time at which a user will become inactive
function updateTime(req, res, next) {
	db.none('UPDATE users SET free_until=$1 WHERE id=$2', [req.body.freeUntil, parseInt(req.params.id)]).then(function() {
		res.status(200).json({
			status: 'success',
			message: 'Updated the time at which the user will become inactive'
		});
	}).catch(function(err) {
		return next(err);
	});
};

// Enable or disable the user's timer
function toggleTimer(req, res, next) {
	db.none('UPDATE users SET timer_enabled=$1 WHERE id=$2', [req.body.timerEnabled, parseInt(req.params.id)]).then(function() {
		res.status(200).json({
			status: 'success',
			message: 'Toggled the timer of the user'
		});
	}).catch(function(err) {
		return next(err);
	});
};

// Export all functions
module.exports = {
	getAllUsers: getAllUsers,
	getUser: getUser,
	updateStatus: updateStatus,
	updateTime: updateTime,
	toggleTimer: toggleTimer
};