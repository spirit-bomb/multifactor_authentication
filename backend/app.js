import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cookp from "cookie-parser";
import cors from "cors";
import {registerUser,loginUser,verifyOtp,logout,getUser,resendOtp} from "./controllers/user.js";
import {authenticate} from "./utils/authenticate.js";

const app=express();
app.use(express.json());
app.use(cookp());
app.use(cors({
    origin:[process.env.FRONTEND_URI],
    method:["GET","POST","PUT","DELETE"],
    credentials:true,
}));

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            dbName:"MFA_auth",
        }).then(()=>{
            console.log("MongoDB connected");
        })
    }
    catch(err){
        console.log(err);
    }
}

app.post('/api/register',registerUser);
app.post('/api/login',loginUser);
app.post('/api/verify',verifyOtp);
app.post('/api/resend',resendOtp);
app.get('/api/user',authenticate,getUser);
app.get("/api/logout",authenticate,logout);
app.get("/",(req,res)=>{
    res.send("hello hello")
})

const port=process.env.PORT||3000
connectDB();
app.listen(port,()=>{
    console.log(`Server started`);
})
