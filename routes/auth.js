const express = require('express');
const { signIn, signUp } = require("../controllers/auth");
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", signIn);

module.exports = router;
