import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { AuthContext } from '../providers/AuthProvider';
import { fetchHostingEvents } from '../services/eventService';
import { EventOut } from '../types/event';

export default function HostingEvents() {
    // Redirect to home if not logged in
    const auth = useContext(AuthContext);
    if (!auth?.user) {
        return <Navigate to="/" />;
    }

    // State for events and loading status
    const navigate = useNavigate();
    const [events, setEvents] = useState<EventOut[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch hosting events
    const fetchEvents = async () => {
        try {
            const data = await fetchHostingEvents();
            setEvents(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="w-2/3 mx-auto mt-8">
            <div className="flex justify-between">
                <button
                    className="mb-4 bg-gray-200 px-3 py-1 rounded"
                    onClick={() => navigate('/dashboard')}
                >
                    Back to Dashboard
                </button>
                <button
                    className="mb-4 bg-blue-200 px-3 py-1 rounded"
                    onClick={() => navigate('/events/create')}
                >
                    Create Event
                </button>
            </div>
            <h2 className="text-xl font-bold mb-2">Events You're Hosting</h2>
            {loading ? (
                <div>Loading...</div>
            ) : events.length === 0 ? (
                <div>No events found.</div>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr>
                            <th className="border px-2 py-1">Title</th>
                            <th className="border px-2 py-1">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event: EventOut) => (
                            <tr key={event.id}>
                                <td className="border px-2 py-1 flex items-center gap-2">
                                    {event.title}
                                    <button
                                        className="ml-2 p-1 rounded hover:bg-gray-100"
                                        title="Edit Event"
                                        onClick={() =>
                                            navigate(`/events/edit/${event.id}`)
                                        }
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-gray-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M17.414 2.586a2 2 0 00-2.828 0l-9.192 9.192A2 2 0 004 13.414V16a2 2 0 002 2h2.586a2 2 0 001.414-.586l9.192-9.192a2 2 0 000-2.828l-2.828-2.828zM5 15v-2.586l9-9L16.586 6l-9 9H5z" />
                                        </svg>
                                    </button>
                                </td>
                                <td className="border px-2 py-1">
                                    {event.description}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
