const express = require("express");
const router = express.Router();
const { auth } = require("../controllers");

router.post("/login", auth.login);
router.get("/refresh", auth.refresh);
router.get("/sign-out", auth.sign_out);
router.post("/register", auth.register);

module.exports = router;
