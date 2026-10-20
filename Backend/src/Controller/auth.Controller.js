const userModel = require("../Models/user.model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const imagekit = require("../config/imagekit")
const {toFile} = require("@imagekit/nodejs") 

async function registerController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const existingUser = await userModel.findOne({
            $or: [{ username }, { email }]
        })

        if (existingUser) {
            return res.status(409).json({
                message: 'Username or email already exists'
            })
        }


        const hashPassword = await bcrypt.hash(password, 10)


        const user = await userModel.create({
            username,
            email,
            password: hashPassword
        })


        const token = jwt.sign(
            {
                userId: user._id,
            },
            process.env.JWT, { expiresIn: "1d" }
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            message: "User registered successfully",

            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Internal Server Error!!"
        })

    }
}


async function loginController(req, res) {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            })
        }

        const user = await userModel.findOne({ username })

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password!"
            })
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        )

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid username or password!"
            })
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT,
            { expiresIn: "1d" }
        )
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message:"Login successful",
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        })


    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


async function profileController(req,res) {
    const user = await userModel.findById(req.userId)

    return res.status(200).json({
        message:"Profile fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

async function uploadProfileImageController(req,res) {
    try {
        const user = await userModel.findById(req.userId)

    if(!user){
        return res.status(404).json({
            message: "User not found"
        })
    }
    if(!req.file){
        return res.status(400).json({
            message:"Please select an image"
        })
    }

    const file = await toFile(
        req.file.buffer,
        req.file.originalname
    )

    const result = await imagekit.files.upload({
        file:file,
        fileName:req.file.originalname,
        folder:"/instagramClone"

    })
    user.profileImage = result.url
    await user.save()

    res.status(200).json({
        message:"Profile picture uploaded successfully",
        profileImage:user.profileImage
    })
    } catch (error) {
        res.status(500).json({
            message:"Profile picture upload failed",
            error:error.message
        })
        
    }
}



module.exports = {
    registerController,
    loginController,
    profileController,
    uploadProfileImageController
}