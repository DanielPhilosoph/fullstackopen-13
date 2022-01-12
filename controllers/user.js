const router = require("express").Router();

const { User, Blogs } = require("../models");
const { userFinder, usernameFinder } = require("../util/middleware");

router.get("/", async (req, res) => {
  const users = await User.findAll({});
  res.json(users);
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/:id", userFinder, async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).end();
  }
});

router.put("/:username", usernameFinder, async (req, res) => {
  const isGivenNameInBody = Boolean(req.body.name);
  if (req.user) {
    req.user.name = isGivenNameInBody ? req.body.name : req.user.name;
    await req.user.save();
    res.json(req.user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
