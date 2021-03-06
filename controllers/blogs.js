const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const { Blogs, User } = require("../models");
const { isNumber } = require("../helper/functions");
const { blogFinder, tokenExtractor } = require("../util/middleware");

router.get("/", async (req, res) => {
  const hasQueryParamSearch = Boolean(req.query.search);
  const blogs = await Blogs.findAll({
    include: {
      model: User,
    },
    where: {
      [Op.or]: {
        title: {
          [Op.substring]: hasQueryParamSearch ? req.query.search : "",
        },
        author: {
          [Op.substring]: hasQueryParamSearch ? req.query.search : "",
        },
      },
    },
    order: [["likes", "DESC"]],
  });
  // console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  if (req.body && req.body.title && req.body.url && req.body.year) {
    try {
      const isValidYear =
        req.body.year > 1991 && req.body.year <= new Date().getFullYear();
      if (isValidYear) {
        const user = await User.findByPk(req.decodedToken.id);
        const blog = await Blogs.create({
          ...req.body,
          userId: user.id,
          date: new Date(),
        });
        return res.json(blog);
      } else {
        return res.status(400).json({ error: "Invalid Year" });
      }
    } catch (error) {
      return res.status(400).json({ error });
    }
  } else {
    return res.status(400).json({ error: "Missing title / url" });
  }
});

router.put("/:id", tokenExtractor, blogFinder, async (req, res) => {
  const isBodyHasAuthor = Boolean(req.body.author);
  const isBodyHasUrl = Boolean(req.body.url);
  const isBodyHasTitle = Boolean(req.body.title);
  const isBodyHasLikes = Boolean(req.body.likes);
  if (req.blog) {
    req.blog.author = isBodyHasAuthor ? req.body.author : req.blog.author;
    req.blog.url = isBodyHasUrl ? req.body.url : req.blog.url;
    req.blog.title = isBodyHasTitle ? req.body.title : req.blog.title;
    req.blog.likes =
      isBodyHasLikes && isNumber(req.body.likes)
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
