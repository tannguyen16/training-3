var express = require('express');
var UserModel = require('../models/Users');
var router = express.Router();

router.post('/', async (req, res) => {
  var newUser = new UserModel(req.body);

  try {
    await newUser.save();
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

router.get('/', async function(req, res, next) {
  let { sort, dir } = req.query;
  dir = dir !== undefined ? dir : -1;
  let sortQuery = {};
    if (sort) {
      sortQuery[sort] = dir;
    }

  const users = await UserModel.find().sort(sortQuery);
  res.render('index', { title: 'Student Grade Table', users, sort, dir });
});

router.get('/delete/:id', async function(req, res, next) {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return;
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

router.get('/edit/:id', async function(req, res, next) {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return;
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

module.exports = router;