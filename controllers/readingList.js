const router = require("express").Router();

const ReadingList = require("../models/readingList");
const { tokenExtractor } = require("../util/middleware");

router.post("/", tokenExtractor, async (req, res) => {
  if (req.body && req.body.blog_id && req.body.user_id) {
    try {
      const readingList = await ReadingList.create(req.body);
      return res.json(readingList);
    } catch (error) {
      return res.status(400).json({ error });
    }
  } else {
    return res.status(400).json({ error: "Missing user_id / blog_id in body" });
  }
});

module.exports = router;
