const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const controller = require("../controllers/UserController");
//router.get("/", controller.get);
module.exports = router;

var mysql = require("mysql2/promise");
var pool = mysql.createPool({
  host: "db_container",
  user: "root",
  password: "root",
  database: "db_login",
  port: 3306,
  queueLimit: 0,
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
  if (!req.body.mail || !req.body.password) {
    return res.render("login", {
      name: "il manque un mail ou un mot de passe",
    });
  }
  //si il y a les deux champs rempli on passe au requête sql

  const mail = req.body.mail.toString();
  const query = `SELECT motDePasse, sel FROM T_user where addresseMail = ?;`;
  pool.query(query, mail, function (error, results, fields) {
    if (error) throw error;

    const sel = results[0].sel;
    console.log("sel", results[0].sel);

    const mdpcrypt = results[0].motDePasse;
    console.log("mdpdb", mdpcrypt);

    console.log("mdp en claire", req.body.password);

    const newmdpcrypt = crypto.hash("sha256", req.body.password + sel);
    console.log("hash du mdp", newmdpcrypt);

    if (newmdpcrypt == mdpcrypt) {
      res.render("menu", { name: "connexion reussi" });
    } else {
      res.render("login", { name: "mail ou mot de passe incorrecte" });
    }
  });
});
router.post("/register", (req, res) => {
  const salt = crypto.randomBytes(8).toString("hex");
  console.log(salt);
  const cryptedPw = crypto.hash("sha256", req.body.pw + salt);

  const query = `INSERT INTO T_user (addresseMail, motDePasse, sel) VALUES (?, ?, ?);`;
  const values = [req.body.mail, cryptedPw, salt];

  pool.query(query, values);
  res.redirect("http://localhost:8080/user/menu");
});
