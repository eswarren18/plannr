import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function Home() {
    const auth = useContext(AuthContext);
    if (auth?.user) {
        return <Navigate to="/dashboard" />;
    }
    return (
        <div className="flex flex-col fixed inset-0 items-center justify-center overflow-y-auto">
            <h1 className="text-5xl font-bold text-center">
                Welcome to Plannr!
            </h1>{' '}
        </div>
    );
}
