const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const controller = require("../controllers/UserController");
//router.get("/", controller.get);
module.exports = router;

var mysql = require("mysql2");
var connection = mysql.createConnection({
  host: "db_container",
  user: "root",
  password: "root",
  database: "db_login",
  port: 3306,
});

router.get("/login", (req, res) => {
  res.render("login", { name: "Antoine" });
});

router.get("/register", (req, res) => {
  res.render("register", { name: "nameless" });
});
router.get("/menu", (req, res) => {
  console.log(req.body);
  res.render("menu", { name: req.body.mail });
});

router.post("/login", (req, res) => {
  connection.connect();
  const user = req.body.mail.toString();
  const query = `SELECT `;
});
router.post("/register", (req, res) => {
  connection.connect();
  const salt = crypto.randomBytes(8).toString("hex");
  console.log(salt);
  const cryptedPw = crypto.hash("sha256", req.body.pw + salt);

  const query = `INSERT INTO T_user (addresseMail, motDePasse, sel) VALUES (?, ?, ?);`;
  const values = [req.body.mail, cryptedPw, salt];

  connection.query(query, values);
  res.redirect("http://localhost:8080/user/menu");

  connection.end();
});
