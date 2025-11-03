import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { AuthContext } from '../providers/AuthProvider';
import { fetchHostingEvents } from '../services/eventService';

export default function HostingEvents() {
    // Redirect to home if not logged in
    const auth = useContext(AuthContext);
    if (!auth?.user) {
        return <Navigate to="/" />;
    }

    // State for events and loading status
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch hosting events
    const fetchEvents = async () => {
        try {
            const data = await fetchHostingEvents();
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
        <div className="w-2/3 mx-auto mt-8">
            <button
                className="mb-4 bg-gray-200 px-3 py-1 rounded"
                onClick={() => navigate('/dashboard')}
            >
                &larr; Back to Dashboard
            </button>
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
                        {events.map((event: any) => (
                            <tr key={event.id}>
                                <td className="border px-2 py-1">
                                    {event.title}
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
