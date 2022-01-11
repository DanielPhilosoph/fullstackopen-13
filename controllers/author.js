const router = require("express").Router();

const { Blogs, User } = require("../models");
const { sequelize } = require("../models/user");

router.get("/", async (req, res) => {
  const authors = await Blogs.findAll({
    group: "author",
    attributes: [
      "author",
      [sequelize.fn("COUNT", "author"), "articles"],
      [sequelize.fn("COUNT", "likes"), "totalLikes"],
    ],
  });
  res.json(authors);
});

module.exports = router;
