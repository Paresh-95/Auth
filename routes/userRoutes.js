const express = require("express")
const router = express.Router()
const {login,signup,getUser} = require("../controller/Auth")
const {auth} = require("../middlewares/auth")


router.post("/login",login)
router.post("/signup",signup)
router.get("/getUser",auth,getUser)

module.exports = router;