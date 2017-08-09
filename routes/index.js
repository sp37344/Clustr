var express = require('express');
var router = express.Router();

var userDb = require('../api/users');

router.get('/api/clustr/users', userDb.getAllUsers);
router.get('/api/clustr/users/:id', userDb.getUser);
router.put('/api/clustr/users/:id/status', userDb.updateStatus);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Clustr Home Page' });
});

module.exports = router;