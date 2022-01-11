const router = require("express").Router();

const { User, Blogs } = require("../models");

//? Middleware
const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id);
  next();
};

//? Middleware
const usernameFinder = async (req, res, next) => {
  req.user = await User.findOne({ where: { username: req.params.username } });
  next();
};

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blogs,
      attributes: { exclude: ["userId"] },
    },
  });
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
