import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Verify from './pages/Verify';
import Welcome from './pages/Welcome';
import {Toaster} from 'react-hot-toast';

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/me" element={<Welcome />} />

            </Routes>
            <Toaster/>
        </>
    );
};

export default App;
