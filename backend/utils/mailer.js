import nodemailer from "nodemailer";
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
});

export const sendOtp=async(to,otp)=> {
    try{
        const info = await transporter.sendMail({
            from: '"Garrick Berge" <bruceispeter@gmail.com>',
            to,
            subject: "OTP for Multifactor authentication",
            text: "One Time Password",
            html: `<p>Your One Time Password for authentication is ${otp}</p>`,
        });

        console.log("Message sent: %s", info.messageId);
    }
    catch(err){
        console.log(err);
    }
}

