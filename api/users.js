var promise = require('bluebird');

var options = {
	// Initialization options
	promiseLib: promise
}

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/kittens';
var db = pgp({
	host: 'localhost',
	port: 5432,
	database: 'clustr',
	user: 'postgres',
	password: 'c1ustR!17'
});

// Add query functions
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

module.exports = {
	getAllUsers: getAllUsers,
	getUser: getUser
};