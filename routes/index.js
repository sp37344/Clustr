var express = require('express');
var router = express.Router();

var userDb = require('../api/users');
var activitiesDb = require('../api/activities');
var activeUsersDb = require('../api/active-users');

// Users API
router.get('/api/clustr/users', userDb.getAllUsers);
router.get('/api/clustr/users/:id', userDb.getUser);
router.put('/api/clustr/users/:id/status', userDb.updateStatus);
router.put('/api/clustr/users/:id/time', userDb.updateTime);
router.put('/api/clustr/users/:id/toggle-timer', userDb.toggleTimer);

// Activities API
router.get('/api/clustr/activities/:id', activitiesDb.getAllActivities);
router.post('/api/clustr/activities/:id', activitiesDb.addActivity);
router.put('/api/clustr/activities/:id', activitiesDb.editActivity);
router.delete('/api/clustr/activities/:id', activitiesDb.deleteActivity);

// Active Users API
router.post('/api/clustr/active-users', activeUsersDb.addUser);
router.get('/api/clustr/active-users/:id', activeUsersDb.getActiveUser);
router.get('/api/clustr/active-users/friends/:friends', activeUsersDb.getActiveFriends);
router.put('/api/clustr/active-users/:id/location', activeUsersDb.updateLocation);
router.delete('/api/clustr/active-users/:id', activeUsersDb.removeActiveUser);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Clustr Home Page' });
});

module.exports = router;