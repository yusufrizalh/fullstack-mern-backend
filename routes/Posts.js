const express = require("express");
const { Posts } = require("../models");
const router = express.Router();

// method GET
router.get("/", async (req, res) => {
  const allPosts = await Posts.findAll(); // SELECT * FROM posts
  res.json(allPosts);
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
