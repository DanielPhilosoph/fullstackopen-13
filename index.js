const express = require("express");
require("express-async-errors");

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");
const blogRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/author");

const app = express();
app.use(express.json());

app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
