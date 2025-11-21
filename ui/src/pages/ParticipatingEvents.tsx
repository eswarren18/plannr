import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { ProfileCard } from '../components/ProfileCard';
import { AuthContext } from '../providers/AuthProvider';
import { fetchParticipatingEvents } from '../services/eventService';
import { EventSummaryOut } from '../types/event';

export default function ParticipatingEvents() {
    // Redirect to home if not logged in
    const auth = useContext(AuthContext);
    if (!auth?.user) {
        return <Navigate to="/" />;
    }

    // State for events and loading status
    const [events, setEvents] = useState<EventSummaryOut[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    // Fetch participating events
    const fetchEvents = async () => {
        try {
            const data = await fetchParticipatingEvents();
            setEvents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen z-10">
            <ProfileCard />
            <div
                className="fixed right-0 w-3/4 pt-20 pb-8 flex flex-col items-center overflow-y-auto"
                style={{
                    height: 'calc(100vh - 4rem)',
                    maxHeight: 'calc(100vh - 4rem)',
                }}
            >
                <div className="w-4/5 mx-auto">
                    <button
                        className="cursor-pointer bg-gray-200 px-3 py-1 rounded text-gray-800 font-semibold transition-colors duration-200 focus:outline-none hover:bg-gray-300"
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                    <h2 className="text-xl font-bold mt-4 mb-2">
                        Events You're Participating In
                    </h2>
                    {loading ? (
                        <div>Loading...</div>
                    ) : events.length === 0 ? (
                        <div>No events found.</div>
                    ) : (
                        <table className="w-full border">
                            <thead>
                                <tr>
                                    <th className="border px-2 py-1">Title</th>
                                    <th className="border px-2 py-1">Host</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event: EventSummaryOut) => (
                                    <tr key={event.id}>
                                        <td className="border px-2 py-1">
                                            {event.title}
                                        </td>
                                        <td className="border px-2 py-1">
                                            {event.hostName}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
