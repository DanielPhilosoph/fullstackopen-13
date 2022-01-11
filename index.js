const express = require("express");
require("express-async-errors");

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");
const blogRouter = require("./controllers/blogs");

const app = express();

app.use("/api/blogs", blogRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
