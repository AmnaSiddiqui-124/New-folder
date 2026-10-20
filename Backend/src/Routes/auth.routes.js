const express = require('express')
const authController = require('../Controller/auth.Controller')
const identifyUser = require("../Middleware/identifyUser")
const upload = require("../Middleware/multer")

const routes = express.Router()


routes.post('/register',authController.registerController)

routes.post("/login",authController.loginController)

routes.get('/profile',identifyUser,authController.profileController)

routes.put('/profile/image',identifyUser,upload.single("profileImage"),authController.uploadProfileImageController)


module.exports = routes