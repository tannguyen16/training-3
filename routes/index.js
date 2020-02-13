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

const sortDir = (req) => {
  let { sort, dirName, dirGrade } = req.query;

  dirName = dirName !== undefined ? dirName : -1;
  dirGrade = dirGrade !== undefined ? dirGrade : -1;
  let sortQuery = {};
  if (sort === 'name') {
    sortQuery[sort] = dirName;
  }
  if (sort === 'grade') {
    sortQuery[sort] = dirGrade;
  }

  const result = {
    dirName,
    dirGrade,
    sortQuery
  }
  return result;
}

router.get('/', async function(req, res, next) {
  let { sort } = req.query;

  const result = sortDir(req);
  let { dirName, dirGrade } = result;
  const users = await UserModel.find().sort(result.sortQuery);
  res.render('index', { title: 'Student Grade Table', users, sort, dirName, dirGrade });
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
    let { sort, name, grade } = req.query;

    const result = sortDir(req);
    let { dirName, dirGrade } = result;
  
    const users = await UserModel.find().sort(result.sortQuery);

    if (!users) return;
    res.render('edit', { title: 'Student Grade Table', users, sort, dirName, dirGrade, id : req.params.id, name, grade });
  } catch (err) {
    next(err);
  }
});

router.post('/save/:id', async function(req, res, next) {
  try {
    let { sort } = req.query;

    const result = sortDir(req);
    let { dirName, dirGrade } = result;
  
    await UserModel.findByIdAndUpdate(req.params.id, req.body);

    const users = await UserModel.find().sort(result.sortQuery);

    if (!users) return;
    res.render('index', { title: 'Student Grade Table', users, sort, dirName, dirGrade });
  } catch (err) {
    next(err);
  }
});


module.exports = router;