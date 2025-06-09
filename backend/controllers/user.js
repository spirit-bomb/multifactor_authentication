import User from "../modals/users.js";
import bcrypt from "bcrypt";
import validator from "validator";
import {sendOtp} from "../utils/mailer.js"
import {generateOTP} from "../utils/generateOTP.js";
import jwt from "jsonwebtoken";


const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

export const registerUser=async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        const exist=await User.findOne({email});
        if(exist){
            return res.status(400).json({
                success:false,
                message:"user already exists",
            })
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({
                success:false,
                message:"invalid email",
            })
        }
        if(password.length<8){
            return res.status(400).json({
                success:false,
                message:"password must be at least 8 characters",
            })
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            name:name,
            email:email,
            password:hashedPassword
        })
        await newUser.save();
        return res.status(201).json({
            success:true,
            message:"user created",
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"internal server error",
        })
    }
}

export const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const exist=await User.findOne({email});
        if(!exist){
            return res.status(400).json({
                success:false,
                message:"user does not exist",
            })
        }
        const isMatch=await bcrypt.compare(password,exist.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"invalid credentials",
            })
        }
        const otp=generateOTP();
        const otpExpire=Date.now()+10*60*1000;
        exist.otp=otp;
        exist.otpExpiresAt=otpExpire;
        exist.otpSentAt = Date.now()
        await exist.save();
        await sendOtp(exist.email,otp);
        res.cookie("authEmail",email,{httpOnly:true,maxAge:10 * 60 * 1000});
        return res.json({
            message:"otp sent"
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"internal server error",
        })
    }
}

export const verifyOtp = async (req, res) => {
    const { otp } = req.body;
    const email = req.cookies.authEmail;

    if (!email) return res.status(400).json({
        success:false,
        message: 'Session expired, login again'
    });

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || new Date() > user.otpExpiresAt) {
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired OTP'
        });
    }
    const token = createToken(user._id);
    user.otp = null;
    user.otpExpiresAt = null;
    user.otpSentAt = null;
    await user.save();
    res.cookie("token",token,{
        httpOnly:true,
    }).clearCookie('authEmail').json({
        success: true,
        message: 'Login successful'
    });
}

export const logout=async(req,res)=>{
    try{
        res.status(200).cookie("token","",{
            expires:new Date(Date.now())
        }).json({
            success:true,
            message:"logged out successfully",
        })
    }
    catch(error){
        console.log(error);
    }
}

export const getUser=async(req,res)=>{
    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        },
    });
}

export const resendOtp=async(req,res)=>{
    try{
        const email = req.cookies.authEmail;

        if (!email) return res.status(400).json({
            success:false,
            message: 'Session expired, login again'
        });

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({
            success:false,
            message: 'User not found'
        });
        const now = Date.now();
        const lastSent = user.otpSentAt ? user.otpSentAt.getTime() : 0;
        const diff = now - lastSent;

        if (diff < 2 * 60 * 1000) {
            return res.status(429).json({
                success: false,
                message: `Please wait 2 minutes before resending OTP.`,
            });
        }
        else{
            const otp = generateOTP();
            const otpExpire = now + 10 * 60 * 1000;

            user.otp = otp;
            user.otpExpiresAt = otpExpire;
            user.otpSentAt = Date.now();
            await user.save();

            await sendOtp(email, otp);

            return res.json({
                success:true,
                message: 'New OTP sent to email'
            });
        }

    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message: 'Internal server error'
        });
    }
}