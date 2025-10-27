import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function Home() {
    const auth = useContext(AuthContext);
    if (auth?.user) {
        return <Navigate to="/dashboard" />;
    }
    return <h1>Welcome to Plannr!</h1>;
}
