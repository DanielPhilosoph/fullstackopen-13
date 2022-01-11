const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { Blogs, User } = require("../models");
const { isNumber } = require("../helper/functions");
const { SECRET } = require("../util/config");

//? Middleware
const blogFinder = async (req, res, next) => {
  req.blog = await Blogs.findByPk(req.params.id);
  next();
};

//? Middleware
const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

router.get("/", async (req, res) => {
  const blogs = await Blogs.findAll({
    include: {
      model: User,
    },
  });
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  if (req.body && req.body.title && req.body.url) {
    try {
      const user = await User.findByPk(req.decodedToken.id);
      const blog = await Blogs.create({
        ...req.body,
        userId: user.id,
        date: new Date(),
      });
      return res.json(blog);
    } catch (error) {
      return res.status(400).json({ error });
    }
  } else {
    return res.status(400).json({ error: "Missing title / url" });
  }
});

router.put("/:id", tokenExtractor, blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.author = req.body.author ? req.body.author : req.blog.author;
    req.blog.url = req.body.url ? req.body.url : req.blog.url;
    req.blog.title = req.body.title ? req.body.title : req.blog.title;
    req.blog.likes =
      req.body.likes && isNumber(req.body.likes)
        ? req.body.likes
        : req.blog.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    return res
      .status(400)
      .json({ error: "Missing query param / could not find blog" });
  }
});

router.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    try {
      await Blogs.destroy({
        where: {
          id: req.params.id,
        },
      });
      return res.send("Deleted");
    } catch (error) {
      return res.status(400).json({ error });
    }
  } else {
    return res
      .status(400)
      .json({ error: "Missing query param / could not find blog" });
  }
});

module.exports = router;
