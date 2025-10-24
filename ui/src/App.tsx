import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';

import './index.css';

const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

function App() {
    return (
        <>
            <Nav />
            <Outlet />
        </>
    );
}

export default App;
