var express = require('express');
var UserModel = require('../models/Users');
var router = express.Router();
var qs = require('qs');
let yup = require('yup');

let studentSchema = yup.object().shape({
  name: yup
    .string('Name must be a string')
    .min(3, 'Name must have more than 3 characters')
    .required('Name is a required field'),
  grade: yup
    .number('Grade must be a number')
    .integer('Grade must be an integer')
    .max(100, 'Grade must be less than or equal to 100')
    .required('Grade is a required field')
    .positive('Grade must be positive'),
});

const renderParams = async (req) => {
  const params = req.query;
  const sort = {};
  if (params.sortType && params.sortDir){
    const sortTypes = params.sortType.split(',');
    const sortDirections = params.sortDir.split(',');
    
    for (let i = 0; i < sortTypes.length; i++) {
      const type = sortTypes[i];
      const dir = Number(sortDirections[i]);

      sort[type]= dir;
    }
  }

  const users = await UserModel.Get({}, sort);
  const sortQuery = qs.stringify(req.query);

  const handleSortQuery = function(field) {
    const currentSort = {...sort};
    const currentDir = currentSort[field];
    switch (currentDir) {
      case 1:
        currentSort[field] = -1;
        break;
      case -1:
        delete currentSort[field];
        break;
      default:
        currentSort[field] = 1;
        break;
    }
    const output = {
      sortType: Object.keys(currentSort).join(','),
      sortDir: Object.values(currentSort).join(','),
    }

    return qs.stringify(output);
  }

  return {
    users, sortQuery, handleSortQuery
  }
}

router.post('/', async (req, res) => {
  var newUser = new UserModel(req.body);
  try {
    await studentSchema.validate(newUser);
    await newUser.save();
    res.redirect('/');
  } catch (err) {
    if(err.errors) {
      const params = await renderParams(req);
      const users = params.users;
      const sortQuery = params.sortQuery;
      const handleSortQuery = params.handleSortQuery;
      if (err.params.path === 'name') res.render('index', { title: 'Student Grade Table', users, sortQuery, handleSortQuery, errorName: err.message, errorGrade: ''});
      else res.render('index', { title: 'Student Grade Table', users, sortQuery, handleSortQuery, errorName: '', errorGrade: err.message});
    } else {
      next(err);
    }
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
  try {
    const params = await renderParams(req);
    const { users, sortQuery, handleSortQuery } = params;
    res.render('index', { title: 'Student Grade Table', users, sortQuery, handleSortQuery, errorName: '', errorGrade: ''});

  } catch (err) {
    next(err);
  }
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
    const { name, grade, id } = req.params;
    const params = await renderParams(req);
    const { users, sortQuery, handleSortQuery } = params;

    if (!users) return;
    res.render('edit', { title: 'Student Grade Table', id, users, sortQuery, handleSortQuery, errorName: '', errorGrade: '', name, grade });
  } catch (err) {
    next(err);
  }
});

router.post('/save/:id', async function(req, res, next) {
  try {
    studentSchema.validate(req.body);
    let { sort } = req.query;

    const result = sortDir(req);
    let { dirName, dirGrade } = result;

    await UserModel.findByIdAndUpdate(req.params.id, req.body);

    const users = await UserModel.find().sort(result.sortQuery);

    if (!users) return;
    res.render('index', { title: 'Student Grade Table', users, sort, dirName, dirGrade });
  } catch (err) {
    if (err.errors) {
      alert(err.errors[0]);
    }
    next(err);
  }
});

module.exports = router;