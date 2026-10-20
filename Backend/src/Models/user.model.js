const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        required:true,
        unique:true,
        type:String
    },
    email:{
        required:true,
        unique:true,
        type:String
    },
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/hvgbzzbx6/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3485.avif?updatedAt=1790682095826"
    },
    password:{
        required:true,
        type:String
    }
})
const userModel = mongoose.model('user',userSchema)

module.exports = userModel