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
  let sortQuery = '';
  if (params.sortType && params.sortDir){
    const sortTypes = params.sortType.split(',');
    sortQuery = qs.stringify({sortType : req.query.sortType, sortDir: req.query.sortDir});
    const sortDirections = params.sortDir.split(',');

    for (let i = 0; i < sortTypes.length; i++) {
      const type = sortTypes[i];
      const dir = Number(sortDirections[i]);

      sort[type]= dir;
    }
  }

  const users = await UserModel.Get({}, sort);

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
  const inputs = {...req.body};
  const errors = {};
  try {
    await studentSchema.validate(req.body, { abortEarly: false });
    await newUser.save();
    const params = await renderParams(req);
    const { users, sortQuery, handleSortQuery } = params;
    // res.render('index', { title: 'Student Grade Table', users, sortQuery, handleSortQuery, errors });
    res.redirect(`/?${sortQuery}`);
  } catch (err) {
    if(err.errors) {
      const params = await renderParams(req);
      const { users, sortQuery, handleSortQuery } = params;


      for(let i = 0; i < err.inner.length; i++) {
        const validationError = err.inner[i];
        errors[validationError.path] = validationError.message;
      }

      res.render('index', { title: 'Student Grade Table', users, sortQuery, handleSortQuery, errors, inputs});
    } else {
      next(err);
    }
  }
});

router.get('/', async function(req, res, next) {
  try {
    const inputs = {};
    const params = await renderParams(req);
    const { users, sortQuery, handleSortQuery } = params;
    res.render('index', { title: 'Student Grade Table', users, sortQuery, handleSortQuery, errors: {}, inputs: {} });
  } catch (err) {
    next(err);
  }
});

router.get('/delete/:id', async function(req, res, next) {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    const params = await renderParams(req);
    const { users, sortQuery, handleSortQuery } = params;
    if (!user) return;
    res.render('index', { title: 'Student Grade Table', users, sortQuery, handleSortQuery, errorName: '', errorGrade: ''});
  } catch (err) {
    next(err);
  }
});

router.get('/edit/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const { name, grade } = req.query;
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
    await studentSchema.validate(req.body);
    await UserModel.findByIdAndUpdate(req.params.id, req.body);
    const params = await renderParams(req);
    const { users, sortQuery, handleSortQuery } = params;
    if (!users) return;
    res.render('index', { title: 'Student Grade Table', users, sortQuery, handleSortQuery, errorName: '', errorGrade: ''});
  } catch (err) {
    if(err.errors) {
      const params = await renderParams(req);
      const users = params.users;
      const sortQuery = params.sortQuery;
      const handleSortQuery = params.handleSortQuery;
      if (err.params.path === 'name') res.render('edit', { title: 'Student Grade Table', id: req.params.id, users, sortQuery, handleSortQuery, errorName: err.message, errorGrade: '', name: req.query.name, grade: req.query.grade});
      else res.render('edit', { title: 'Student Grade Table', id: req.params.id, users, sortQuery, handleSortQuery, errorName: '', errorGrade: err.message, name: req.query.name, grade: req.query.grade});
    } else {
      next(err);
    }
  }
});

module.exports = router;