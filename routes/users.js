var express = require('express');
const userModel = require('../models/users');
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  const users = await userModel.find({});

  try {
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  const user = new userModel(req.body);

  try {
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id)

    if (!user) res.status(404).send("No item found")
    res.status(200).send()
  } catch (err) {
    res.status(500).send(err)
  }
})

router.patch('/:id', async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.params.id, req.body)
    await userModel.save()
    res.send(user)
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router;
