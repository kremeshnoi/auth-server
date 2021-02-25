const express = require("express")
const router = express.Router()
const { auth } = require("../controllers")

router.post("/login", auth.login)
router.get("/refresh", auth.refresh)
router.get("/sign-out", auth.signOut)
router.post("/register", auth.register)

module.exports = router
