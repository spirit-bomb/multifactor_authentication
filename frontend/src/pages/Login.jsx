import { useState,useContext } from 'react';
import Card from '../components/Card';
import {context} from '../main.jsx';
import img1 from '../assets/img1.png';
import api from '../api/axios';
import {useNavigate} from 'react-router';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {isAuthenticated,setIsAuthenticated}=useContext(context);
    let navigate=useNavigate();
    const onLogin=async(e)=>{
        e.preventDefault();
        try{
            const res=await api.post(`/api/login`,{email,password});
            setIsAuthenticated(true);
            toast.success(res.data.message);
            navigate('/verify');

        }
        catch(err){
            console.error(err);
            toast.error(err.response.data.message);
        }
    }
    const goto=()=>{
        navigate('/register');
    }
    return (
        <Card title="Login to Your Account" image={img1}>
            <form className="space-y-5" onSubmit={onLogin}>
                <input className="w-full p-3 bg-gray-700 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="w-full p-3 bg-gray-700 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit"  className="w-full bg-primary hover:bg-cyan-400 text-white p-3 rounded mt-2">Send OTP</button>
                <button type="button" onClick={goto} className="w-full text-sm text-gray-400 hover:text-white underline">Sign Up</button>
            </form>
        </Card>
    );
};

export default Login;
