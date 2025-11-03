import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect to home if not logged in
    if (!auth?.user) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex flex-col items-center mt-8">
            <h1 className="mb-4 text-2xl font-bold">
                Welcome {auth.user.firstName} to your dashboard
            </h1>
            <div className="flex gap-4">
                <button
                    className="bg-cyan-600 text-white px-4 py-2 rounded-2xl font-semibold hover:bg-cyan-400"
                    onClick={() => navigate('/hosting-events')}
                >
                    Hosting Events
                </button>
                <button
                    className="bg-cyan-600 text-white px-4 py-2 rounded-2xl font-semibold hover:bg-cyan-400"
                    onClick={() => navigate('/participating-events')}
                >
                    Participating Events
                </button>
            </div>
        </div>
    );
}
