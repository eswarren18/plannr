import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { Navigate } from 'react-router-dom';

import { ProfileCard } from '../components/ProfileCard';

export default function Dashboard() {
    // Redirect to home if not logged in
    const auth = useContext(AuthContext);
    if (!auth?.user) {
        return <Navigate to="/" />;
    }

    // Page state and navigation
    const navigate = useNavigate();

    return (
        <div className="flex bg-gray-50 min-h-screen z-10">
            {/* Left: Profile Card */}
            <ProfileCard />
            {/* Right: Main Content */}
            <div
                className="fixed right-0 w-3/4 pt-20 pb-8 flex flex-col items-center overflow-y-auto"
                style={{
                    height: 'calc(100vh - 4rem)',
                    maxHeight: 'calc(100vh - 4rem)',
                }}
            >
                <div className="flex flex-row w-4/5 gap-8 justify-center">
                    <button
                        className="flex-1 bg-white rounded-lg shadow-sm px-8 py-10 flex flex-col items-center justify-center cursor-pointer hover:bg-cyan-50 transition border border-gray-200"
                        onClick={() => navigate('/events')}
                    >
                        <h2 className="text-xl font-bold mb-2">Events</h2>
                        <span className="text-gray-500">
                            View you're events
                        </span>
                    </button>
                    <button
                        className="flex-1 bg-white rounded-lg shadow-sm px-8 py-10 flex flex-col items-center justify-center cursor-pointer hover:bg-cyan-50 transition border border-gray-200"
                        onClick={() => navigate('/invites')}
                    >
                        <h2 className="text-xl font-bold mb-2">
                            My Invitations
                        </h2>
                        <span className="text-gray-500">
                            View your event invites
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
