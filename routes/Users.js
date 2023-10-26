const express = require("express");
const { Users } = require("../models");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");

// method GET /auth untuk menghindari fake token
router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

// method POST untuk register user
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("User is registered!");
  });
});

// method POST untuk login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: username } }); // hanya 1 data

  // mendeteksi user sudah register atau belum
  if (!user) {
    // res.json({ error: "User doesn't exists!" }); // hasil langsung dikirim ke client
    return res.json({ error: "User doesn't exists!" }); // hasil dicek dahulu di server
  }
  // setelah user sudah register kemudian cek kesesuaian password
  if (user) {
    // mendeteksi password match atau tidak
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        return res.json({ error: "Wrong password!" });
      }

      // cek ada webtoken atau tidak
      const accessToken = sign(
        {
          username: user.username,
          id: user.id,
        },
        "importantsecret" // nama sign
      );

      // user sudah register, password match dan terdeteksi ada token
      return res.json({
        message: "User is logged in!",
        accessToken: accessToken,
        username: username,
        id: user.id,
      });
    });
  }
});

module.exports = router;
