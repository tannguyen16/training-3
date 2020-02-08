var express = require('express');
var userModel = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  const { sort, dir } = req.query;

  try {
    let sortQuery = {}
    if (sort) sortQuery[sort] = dir;

    const users = await userModel.find({}).sort(sortQuery);

    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  const user = new userModel(req.body);

  try {
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);

    if (!user) res.status(404).send("No user found");
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err)
  }
})

router.put('/:id', async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
})



module.exports = router;
