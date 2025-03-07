const jwt = require("jsonwebtoken");
const fs = require("fs");

const auth = (req, res, next) => {
  const authcookie = req.cookies["authcookie"];
  if (authcookie === null) {
    return res.status(401);
  }
  const privateKey = fs.readFileSync("private.key");
  const decodedtoken = jwt.verify(
    authcookie,
    privateKey,
    (err, decodedtoken) => {
      if (err)
        return res.render("login", { name: "vous devez vous connecter " });

      req.user = decodedtoken;
      next();
    }
  );
};
module.exports = auth;
