const {Router}=require('express')

const authController = require("../controllers/auth.controller");
const authMiddleware=require("../middlewares/auth.middleware")
const authRouter=Router()


// router for tha registration for tha new user
authRouter.post("/register",authController.registerUserController)
// router for login of tha user
authRouter.post("/login",authController.loginUserController)

/// logout yha se kr lo yrr
// it clears tha tha token from tha user cookie and adds tha token in tha blacklist
authRouter.post("/logout",authController.userLogOutController)
// it is used for getting tha current user logged in deatails and acceess will be private
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)



module.exports=authRouter