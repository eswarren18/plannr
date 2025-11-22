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

    // Component state and navigation
    const [events, setEvents] = useState<EventSummaryOut[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [toggle, setToggle] = useState<'upcoming' | 'all'>('upcoming');
    const navigate = useNavigate();

    // Fetch event details
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

    // Run the fetchEvents function on component mount
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
                    <div className="flex items-center justify-between mt-4 mb-2">
                        <h2 className="text-2xl font-bold">Events</h2>
                        <div className="flex gap-0 bg-gray-100 rounded-xl p-1">
                            <button
                                className={`cursor-pointer px-4 py-1 rounded-l-lg font-medium shadow transition-colors duration-150 ${toggle === 'upcoming' ? 'bg-cyan-100' : 'bg-gray-50'}`}
                                onClick={() => setToggle('upcoming')}
                            >
                                Upcoming
                            </button>
                            <button
                                className={`cursor-pointer px-4 py-1 rounded-r-lg font-medium shadow transition-colors duration-150 ${toggle === 'all' ? 'bg-cyan-100' : 'bg-gray-50'}`}
                                onClick={() => setToggle('all')}
                            >
                                All
                            </button>
                        </div>
                    </div>
                    {loading ? (
                        <div>Loading...</div>
                    ) : events.length === 0 ? (
                        <div>No events found.</div>
                    ) : (
                        <table className="w-full bg-white rounded-lg shadow-sm">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="py-2 px-4 w-2/3">Title</th>
                                    <th className="py-2 px-4 w-1/3">Host</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event: EventSummaryOut) => (
                                    <tr
                                        key={event.id}
                                        className="border-b last:border-b-0 border-gray-200"
                                    >
                                        <td className="py-2 px-4 w-2/3">
                                            <button
                                                className="hover:text-cyan-400"
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    padding: 0,
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => {
                                                    navigate(
                                                        `/events/${event.id}`,
                                                        {
                                                            state: {
                                                                from: '/participating-events',
                                                            },
                                                        }
                                                    );
                                                }}
                                            >
                                                {event.title}
                                            </button>
                                        </td>
                                        <td className="py-2 px-4 w-1/3 border-l border-gray-200">
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
