const express = require("express");
const { Posts, Likes } = require("../models");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");

// method GET untuk menampilkan seluruh Posts
router.get("/", validateToken, async (req, res) => {
  // SELECT * FROM posts JOIN likes ON
  const allPosts = await Posts.findAll({ include: [Likes] });
  const likedPost = await Likes.findAll({ where: { UserId: req.user.id } }); // post yg sudah ada like
  res.json({ allPosts: allPosts, likedPost: likedPost });
});

// method GET by primary key
router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id); // SELECT * FROM posts WHERE id = ?
  res.json(post);
});

// method POST
router.post("/", async (req, res) => {
  const post = req.body; // body = isian yang diberikan dari form
  await Posts.create(post); // INSERT INTO posts
  console.log("INFO: " + res.statusCode);
  res.json(post);
});

module.exports = router;
