var promise = require('bluebird');

var options = {
	// Initialization options
	promiseLib : promise
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
function getActiveUser(req, res, next) {
	db.one('SELECT * FROM active_users WHERE id = $1', parseInt(req.params.id)).then(function(data) {
		res.status(200).json({
			status: 'success',
			data: data,
			message: 'Retrieved ONE active user'
		});
	}).catch(function(err) {
		return next(err);
	});
};

function getActiveFriends(req, res, next) {
	db.any('SELECT * FROM active_users WHERE id = ANY ($1::int[])', req.params.friends).then(function(data) {
		res.status(200).json({
			status: 'success',
			data: data,
			message: 'Retrived ALL active friends of the user'
		});
	}).catch(function(err) {
		return next(err);
	});
};

function updateLocation(req, res, next) {
	db.none('UPDATE active_users SET latitude = $1, longitude = $2 WHERE id=$3', [parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseInt(req.params.id)]).then(function(data) {
		res.status(200).json({
			status: 'success',
			data: data,
			message: 'Updated location of the user'
		});
	}).catch(function(err) {
		return next(err);
	});
};

function removeActiveUser(req, res, next) {
	db.result('DELETE FROM active_users WHERE id = $1', parseInt(req.params.id)).then(function(result) {
		res.status(200).json({
			status: 'success',
			message: `Removed ${result.rowCount} active user`
		});
	}).catch(function(err) {
		return next(err);
	});
};

// Export all functions
module.exports = {
	getActiveUser: getActiveUser,
	getActiveFriends: getActiveFriends,
	updateLocation: updateLocation,
	removeActiveUser: removeActiveUser
};