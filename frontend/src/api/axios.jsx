import axios from 'axios';

const api = axios.create({
    //baseURL: 'http://localhost:3000', // your backend
    baseURL: 'https://multifactor-authentication-em5l.onrender.com',
    withCredentials: true, // include cookies
});

export default api;
