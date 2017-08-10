var promise = require('bluebird');

var options = {
	// Initialization options
	promiseLib: promise
}

var pgp = require('pg-promise')(options);
var db = pgp({
	host: 'localhost',
	port: 5432,
	database: 'clustr',
	user: 'postgres',
	password: 'c1ustR!17'
});

// QUERY FUNCTIONS

// Get all users
function getAllUsers(req, res, next) {
	db.any('select * from users').then(function(data) {
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
	var userId = req.params.id;
	db.one('select * from users where id = $1', userId).then(function(data) {
		res.status(200).json({
			status: 'success',
			data: data,
			message: 'Retrieved ONE user'
		});
	}).catch(function(err) {
		return next(err);
	});
}

// Update a single user's status
function updateStatus(req, res, next) {
	db.none('update users set status=$1 where id=$2', [req.body.status, req.params.id]).then(function() {
		res.status(200).json({
			status: 'success',
			message: 'Updated user'
		});
	}).catch(function (err) {
		return next(err);
	})
}

// Export all functions
module.exports = {
	getAllUsers: getAllUsers,
	getUser: getUser,
	updateStatus: updateStatus
};