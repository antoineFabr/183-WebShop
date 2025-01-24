const express = require("express");

const app = express();
app.use(express.json());

app.use(express.urlencoded());
const userRoute = require("./routes/User");

app.use("/user", userRoute);
app.use(express.static("public"));
app.set("view engine", "ejs");

// Démarrage du serveur
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
