const jwt = require("jsonwebtoken");
const { SECRET } = require("./config.js");
const { User, Blogs } = require("../models");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

//? Middleware
const blogFinder = async (req, res, next) => {
  req.blog = await Blogs.findByPk(req.params.id);
  next();
};

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

module.exports = { tokenExtractor, blogFinder, userFinder, usernameFinder };
