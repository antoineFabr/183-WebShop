const express = require("express");
const crypto = require("crypto");
const router = express();

const jwt = require("jsonwebtoken");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const auth = require("../auth/auth.js");

//router.get("/", controller.get);

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

router.get("/menu", auth, (req, res) => {
  res.render("menu", { name: req.user.mail, admin: req.user.admin });
});

router.post("/login", async (req, res) => {
  if (!req.body.mail || !req.body.password) {
    console.log("il manque un mail ou un mot de passe");
    return res.render("login", {
      name: "il manque un mail ou un mot de passe",
    });
  }
  //si il y a les deux champs rempli on passe au requête sql

  const mail = req.body.mail.toString();

  const query = `SELECT admin ,mot_de_passe, sel FROM T_user where mail = ?;`;
  try {
    const [results, fields] = await pool.query(query, mail);
    const admin = results[0].admin;

    const sel = results[0].sel;

    const mdphash = results[0].mot_de_passe;

    const newmdphash = crypto.hash("sha256", req.body.password + sel);

    if (newmdphash == mdphash) {
      const privateKey = fs.readFileSync("private.key");

      const token = jwt.sign({ mail: mail, admin: admin }, privateKey, {
        expiresIn: "1y",
      });
      res.cookie("authcookie", token, {
        maxAge: 900000,
        httpOnly: true,
      });
      res.redirect("http://localhost:443/user/menu");
    } else {
      res.render("login", { name: "mail ou mot de passe incorrecte" });
    }
  } catch (err) {
    console.log(err);
  }
});
router.post("/register", (req, res) => {
  const salt = crypto.randomBytes(8).toString("hex");

  const hashPw = crypto.hash("sha256", req.body.password + salt);

  const query = `INSERT INTO T_user (mail, mot_de_passe, sel) VALUES (?, ?, ?);`;
  const values = [req.body.mail, hashPw, salt];

  pool.query(query, values);

  res.redirect("http://localhost:443/user/login");
});

module.exports = router;
