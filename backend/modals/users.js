import mongoose from 'mongoose'


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
    },
    otpExpiresAt:{
        type:Date,
    },
    otpSentAt: {
        type: Date,
        default: null
    }
})
const User=mongoose.models.user||mongoose.model("user",userSchema)
export default User;