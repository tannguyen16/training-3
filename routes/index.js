var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Student Grade' });
});

router.get('/dmindex', function(req, res, next) {
  res.render('dmindex', { title: 'Student Grade - Dark Mode' });
});

module.exports = router;
