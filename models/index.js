const Blogs = require("./blog");
const User = require("./user");
const ReadingList = require("./readingList");

//User.hasMany(Blogs);
Blogs.belongsTo(User);

User.belongsToMany(Blogs, { through: ReadingList });
Blogs.belongsToMany(User, { through: ReadingList });

module.exports = {
  Blogs,
  User,
  ReadingList,
};
