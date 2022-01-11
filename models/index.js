const Blogs = require("./blog");
const User = require("./user");

User.hasMany(Blogs);
Blogs.belongsTo(User);
Blogs.sync({ alter: true });
User.sync({ alter: true });

module.exports = {
  Blogs,
  User,
};
