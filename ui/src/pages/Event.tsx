import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEventById } from '../services/eventService';
import { EventFullOut } from '../types/event';

export default function Event() {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<EventFullOut | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await fetchEventById(Number(eventId));
                if (data instanceof Error) {
                    setError(data.message);
                } else {
                    setEvent(data);
                }
            } catch (err) {
                setError('Failed to load event');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [eventId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!event) return <div>Event not found.</div>;

    return (
        <div className="w-2/3 mx-auto mt-8">
            <button
                className="mb-4 bg-gray-200 px-3 py-1 rounded"
                onClick={() => navigate('/dashboard')}
            >
                Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
            <div className="mb-4">{event.description}</div>
            <div className="mb-4 inline-flex items-center gap-2 border border-black rounded-full px-4 py-2 w-auto">
                <span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                    </svg>
                </span>
                <span className="font-semibold">Host:</span>
                <span>{event.hostName}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold mb-2">Participants</h2>
                <button className="bg-cyan-600 text-white px-3 py-1 rounded font-semibold hover:bg-cyan-400">
                    Invite
                </button>
            </div>
            <div className="space-y-2">
                {event.participants.map((name, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                        </svg>
                        <span>{name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
