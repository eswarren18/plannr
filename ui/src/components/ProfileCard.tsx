import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

export function ProfileCard() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    if (!auth?.user) return null;
    return (
        <div className="w-1/4 h-full fixed left-0 bg-white shadow-md flex flex-col items-center py-10 px-6">
            <div className="w-24 h-24 mb-4 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
                {/* Placeholder for profile pic */}
            </div>
            <div className="text-lg font-semibold mb-1">
                {auth.user.firstName} {auth.user.lastName}
            </div>
            <div className="text-gray-500 mb-4">{auth.user.email}</div>
            <button
                className="cursor-pointer bg-cyan-600 text-white px-3 py-1 rounded font-medium hover:bg-cyan-400 transition"
                onClick={() => {}}
            >
                Edit Profile
            </button>
        </div>
    );
}
