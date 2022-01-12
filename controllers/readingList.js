const router = require("express").Router();

const { User, Blogs } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.post("/", tokenExtractor, async (req, res) => {
  if (req.body && req.body.blog_id && req.body.user_id) {
    try {
      const user = await User.findByPk(req.body.user_id);
      const blog = await Blogs.findByPk(req.body.blog_id);
      console.log("User:");
      console.log(user);
      console.log("Blog:");
      console.log(blog);
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

module.exports = router;
