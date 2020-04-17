//const bcrypt = require("bcrypt");
const User = require("../models/user");
const express = require("express");
const router = express.Router({ mergeParams: true });
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const users = await User.find({});
  return res.send({ data: users, error: null });
});

router.get("/getCurrentUser", async (req, res) => {
  try {
    if (req.headers.token) {
      const { _id } = jwt.decode(req.headers.token);
      const user = await User.findById(_id);
      return res.send({ data: user, error: user ? null : "Invalid token." });
    }
    return res.send({ data: null, error: "Invalid token." });
  } catch (e) {
    console.log(e);
  }
});

router.put("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    await User.updateOne({ _id }, req.body);
    const newUser = await User.findById(_id);
    return res.send({
      data: newUser,
      error: null,
    });
  } catch (e) {
    console.log(e);
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    await User.deleteOne({ _id });
    return res.send({
      data: req.body,
      error: null,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/", async (req, res) => {
  let user = null;
  try {
    user = await User.findOne({ email: req.body.email });

    if (user)
      return res.send({ data: null, error: "User already registered." });

    user = new User(req.body);
    await user.save();

    return res.send({
      data: user,
      error: null,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;