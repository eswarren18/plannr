import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { AuthContext } from '../providers/AuthProvider';
import { fetchHostingEvents, deleteEvent } from '../services/eventService';
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

    const handleDeleteEvent = async (eventId: number) => {
        const result = await deleteEvent(eventId);
        if (result === true) {
            // Refresh events list
            fetchEvents();
        } else if (result instanceof Error) {
            alert(result.message);
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
                                <td className="border px-2 py-1">
                                    <div className="flex items-center justify-between w-full">
                                        <span>{event.title}</span>
                                        <span className="flex gap-2">
                                            <button
                                                className="p-1 rounded hover:bg-gray-100"
                                                title="Edit Event"
                                                onClick={() =>
                                                    navigate(
                                                        `/events/edit/${event.id}`
                                                    )
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="size-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                className="p-1 rounded hover:bg-gray-100"
                                                title="Delete Event"
                                                onClick={() =>
                                                    handleDeleteEvent(event.id)
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="size-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </div>
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
