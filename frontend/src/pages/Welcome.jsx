import {context} from '../main.jsx';
import {Navigate} from 'react-router-dom';
import { useState,useContext,useEffect } from 'react';
import {useNavigate} from 'react-router';
import api from '../api/axios';

const Welcome = () => {
    const {isAuthenticated,setIsAuthenticated}=useContext(context);
    const [user,setUser]=useState(null);
    let navigate=useNavigate();
    useEffect(()=>{
        const getUser=async()=>{
            try{
                const res=await api.get(`/api/user`);
                if(res.data.success){
                    setUser(res.data.user);
                }
            }
            catch(err){
                console.error(err);
                setIsAuthenticated(false);
            }
        };
        getUser();
    },[navigate,setIsAuthenticated]);
    const logOut=async()=>{
        try{
            await api.get(`/api/logout`);
            setIsAuthenticated(false);
            navigate('/');
        }
        catch(err){
            console.error(err);
            alert(err.response.data.message);
        }
    };
    if(!isAuthenticated) return <Navigate to="/"/>
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-center">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome
                {user?(
                        <span className='text-4xl md:text-5xl font-bold text-white mb-4'> {user.name}!</span>
                ):(
                    <span className='text-4xl md:text-5xl font-bold text-white mb-4'> Sir!</span>
                )}
                </h1>
                <p className="text-lg text-gray-400">You’ve successfully logged in using multi-factor authentication.</p>
                <button
                    onClick={logOut}
                    className=" mt-6 px-6 py-2 rounded bg-teal-500 hover:bg-teal-600 transition duration-200 text-white font-semibold"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Welcome;
