const express = require("express");
const mysql = require("mysql2");
const router = express.Router();
const controller = require("../controllers/UserController");
//router.get("/", controller.get);
module.exports = router;
router.get("/login", (req, res) => {
  res.render("login", { name: "Antoine" });
});

router.post("/menu", (req, res) => {
  console.log(req.body);
  res.render("menu", { name: req.body.mail });
});
