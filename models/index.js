const Blogs = require("./blog");
const User = require("./user");

User.hasMany(Blogs);
Blogs.belongsTo(User);

module.exports = {
  Blogs,
  User,
};
