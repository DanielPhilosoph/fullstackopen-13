const router = require("express").Router();

const { Blogs } = require("../models");
const { isNumber } = require("../helper/functions");

//? Middleware
const blogFinder = async (req, res, next) => {
  req.blog = await Blogs.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  const blogs = await Blogs.findAll();
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post("/", async (req, res) => {
  if (req.body && req.body.title && req.body.url) {
    try {
      const blog = await Note.create(req.body);
      return res.json(blog);
    } catch (error) {
      return res.status(400).json({ error });
    }
  } else {
    return res.status(400).json({ error: "Missing title / url" });
  }
});

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.author = req.body.author ? req.body.author : req.blog.author;
    req.blog.url = req.body.url ? req.body.url : req.blog.url;
    req.blog.title = req.body.title ? req.body.title : req.blog.title;
    req.blog.likes =
      req.body.likes && isNumber(req.body.likes)
        ? req.body.likes
        : req.blog.likes;
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
