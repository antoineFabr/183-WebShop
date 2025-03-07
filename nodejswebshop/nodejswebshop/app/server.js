const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const auth = require("./auth/auth");
const app = express();
app.use(express.json());
app.use(express.urlencoded());

app.use(cookieParser());

app.get("/admin", auth, async (req, res) => {
  var mysql = require("mysql2/promise");
  var pool = mysql.createPool({
    host: "db_container",
    user: "root",
    password: "root",
    database: "db_login",
    port: 3306,
    queueLimit: 0,
  });
  const admin = req.user.admin;
  const mail = req.user.mail;
  const query = `SELECT admin ,userId, mail FROM T_user;`;

  const [results, fields] = await pool.query(query);

  res.render("admin", { name: "admin", users: results });
});

const userRoute = require("./routes/User");

app.use("/user", userRoute);
app.use(express.static("public"));
app.set("view engine", "ejs");

// Démarrage du serveur
app.listen(443, () => {
  console.log("Server running on port 8080");
});
