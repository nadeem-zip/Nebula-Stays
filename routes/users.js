const express= require('express');
const router=express.Router();
exports.router = router;
const wrapAsync=require('../util/wrapAsync');
const User=require('../models/user');
const passport=require('passport');
const { saveRedirectUrl } = require('../middleware');
//importing user controller
const userController=require('../controller/userController');
const user = require('../models/user');
//register route

router
.route("/signup")
.get(userController.registerPage)//register get route
.post(wrapAsync(userController.register));//register post route

router.route("/login")
.get(userController.loginPage)//login get route
.post(saveRedirectUrl,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),userController.login);//login post route
//logout route
router.get("/logout",userController.logout)
module.exports=router;