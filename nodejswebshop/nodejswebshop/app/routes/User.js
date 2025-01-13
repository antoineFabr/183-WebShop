const express = require('express');

const router = express.Router();
const controller = require("../controllers/UserController");
router.get('/', controller.get) 
module.exports = router; 
document.getElementById("bouton").onclick = function() {
    document.getElementById("bouton").innerHTML = "click"
};