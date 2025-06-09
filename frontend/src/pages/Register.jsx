import { useState } from 'react';
import Card from '../components/Card';
import api from '../api/axios';
import {useNavigate} from 'react-router';
import img2 from '../assets/img2.png'
import toast from 'react-hot-toast';

const Register = () => {
    let navigate=useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const handleRegister=async(e)=>{
        e.preventDefault();
        try{
            const res=await api.post(`/api/register`,{...form});
            if(res.data.success){
                toast.success(res.data.message);
                navigate('/');
            }
        }
        catch(err){
            console.log(err.response.data);
            toast.error(err.response.data.message);
        }
    }
    const goto=()=>{
        navigate('/');
    }

    return (
        <Card title="Create a New Account" image={img2}>
            <form className="space-y-5" onSubmit={handleRegister}>
                <input className="w-full p-3 bg-gray-700 rounded" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="w-full p-3 bg-gray-700 rounded" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="w-full p-3 bg-gray-700 rounded" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="submit" className="w-full bg-secondary hover:bg-indigo-400 text-white p-3 rounded">Register</button>
                <button type="button" onClick={goto} className="w-full text-sm text-gray-400 hover:text-white underline">Sign In</button>
            </form>
        </Card>
    );
};

export default Register;
