require("dotenv").config();
const { Sequelize, Model, DataTypes } = require("sequelize");
const express = require("express");
const app = express();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

class Blogs extends Model {}
Blogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blogs",
  }
);
Blogs.sync();

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blogs.findAll();
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

app.post("/api/blogs", async (req, res) => {
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

app.delete("/api/blogs/:id", async (req, res) => {
  if (req.params.id) {
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
    return res.status(400).json({ error: "Missing query param" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
