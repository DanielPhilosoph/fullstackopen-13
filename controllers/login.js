const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const User = require("../models/user");

// * Should get body.username and body.password
router.post("/", async (request, response) => {
  const body = request.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect = body.password === "secret";
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  console.log(SECRET);
  const token = jwt.sign(userForToken, SECRET);
  let x = jwt.verify(token, SECRET);
  console.log(x);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
