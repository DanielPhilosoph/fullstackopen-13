const router = require("express").Router();

const { Op } = require("sequelize");
const { User, Blogs, ReadingList } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.post("/", tokenExtractor, async (req, res) => {
  if (req.body && req.body.blog_id && req.body.user_id) {
    try {
      const user = await User.findByPk(req.body.user_id);
      const blog = await Blogs.findByPk(req.body.blog_id);
      await user.addBlogs(blog, { through: { have_read: true } });
      //await blog.addUser(user, { through: { have_read: true } });
      return res.send("yay");
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  } else {
    return res.status(400).json({ error: "Missing user_id / blog_id in body" });
  }
});

router.put("/:id", tokenExtractor, async (req, res) => {
  if (req.body.read !== undefined) {
    const user_id = req.decodedToken.id;
    const readingList = await ReadingList.findAll({
      where: { [Op.and]: { id: req.params.id, userId: user_id } },
    });
    if (readingList.length !== 0) {
      readingList[0].have_read = req.body.read;
      await readingList[0].save();
      res.json({ status: "Updated", readingList: readingList[0] });
    }
  } else {
    return res.status(400).json({ error: "Missing read in body" });
  }
});

module.exports = router;
