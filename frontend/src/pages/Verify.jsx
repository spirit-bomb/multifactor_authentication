import { useState, useContext } from 'react';
import Card from '../components/Card.jsx';
import api from '../api/axios';
import { useNavigate } from 'react-router';
import { context } from '../main.jsx';
import { Navigate } from 'react-router-dom';
import img3 from '../assets/img3.png';
import toast from 'react-hot-toast';

const Verify = () => {
    const [otp, setOtp] = useState('');
    const { isAuthenticated, setIsAuthenticated } = useContext(context);
    let navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/api/verify`, { otp }, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
            setIsAuthenticated(true);
            navigate('/me');
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        }
    };

    const handleResend=async()=>{
        try{
            const res=await api.post(`/api/resend`,{});
            if(res.data.success){
                toast.success(res.data.message);
            }
            else{
                toast.error(res.data.message);
            }
        }
        catch(err){
            console.log(err);
            toast.error(err.response.data.message);
        }
    }

    if (!isAuthenticated) return <Navigate to="/" />;
    return (
        <Card title="Verify OTP" image={img3}>
            <form className="space-y-5">
                <input className="w-full p-3 bg-gray-700 rounded" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                <button className="w-full bg-primary hover:bg-cyan-400 text-white p-3 rounded" type="button" onClick={handleVerify}>Verify</button>
                <button type="button" onClick={handleResend} className="w-full text-sm text-gray-400 hover:text-white underline mt-2">Resend OTP</button>
            </form>
        </Card>
    );
};

export default Verify;