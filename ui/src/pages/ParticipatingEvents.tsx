import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ParticipatingEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            const response = await fetch(
                'http://localhost:9000/api/events/participating',
                {
                    credentials: 'include',
                }
            );
            const data = await response.json();
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
            <h2 className="text-xl font-bold mb-2">
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
