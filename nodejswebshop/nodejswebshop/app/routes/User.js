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
  console.log(req.body);
  res.render("menu", { name: req.body.mail });
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

  const query = `SELECT mot_de_passe, sel FROM T_user where mail = ?;`;
  console.log(req.body.mail, req.body.password);
  try {
    const [results, fields] = await pool.query(query, mail);
    console.log(results);
    const sel = results[0].sel;
    console.log("sel", results[0].sel);

    const mdpcrypt = results[0].mot_de_passe;
    console.log("mdpdb", mdpcrypt);

    console.log("mdp en claire", req.body.password);

    const newmdpcrypt = crypto.hash("sha256", req.body.password + sel);
    console.log("hash du mdp", newmdpcrypt);

    if (newmdpcrypt == mdpcrypt) {
      const privateKey = fs.readFileSync("private.key");
      console.log(privateKey);
      const token = jwt.sign({ mail: mail }, privateKey, {
        expiresIn: "1y",
      });
      res.cookie("authcookie", token, {
        maxAge: 900000,
        httpOnly: true,
      });
      res.redirect("http://localhost:8080/user/menu");
    } else {
      res.render("login", { name: "mail ou mot de passe incorrecte" });
    }
  } catch (err) {
    console.log(err);
  }
});
router.post("/register", (req, res) => {
  const salt = crypto.randomBytes(8).toString("hex");

  console.log(salt);
  const cryptedPw = crypto.hash("sha256", req.body.password + salt);

  const query = `INSERT INTO T_user (mail, mot_de_passe, sel) VALUES (?, ?, ?);`;
  const values = [req.body.mail, cryptedPw, salt];

  pool.query(query, values);

  res.redirect("http://localhost:8080/user/login");
});

module.exports = router;
