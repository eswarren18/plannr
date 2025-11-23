import { useContext, useEffect, useState } from 'react';
import {
    useLocation,
    useParams,
    useNavigate,
    Navigate,
} from 'react-router-dom';

import { ProfileCard } from '../components/ProfileCard';
import Toast from '../components/Toast';
import { AuthContext } from '../providers/AuthProvider';
import { fetchEventById } from '../services/eventService';
import { EventFullOut } from '../types/event';

export default function Event() {
    // Redirect to home if not logged in
    const auth = useContext(AuthContext);
    if (!auth?.user) {
        return <Navigate to="/" />;
    }

    // Component state and navigation
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const showToast = location.state?.showToast;
    const from = location.state?.from || '/dashboard';
    const [event, setEvent] = useState<EventFullOut | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch event details
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

    // Run the fetchData function on component mount
    useEffect(() => {
        fetchData();
    }, [eventId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!event) return <div>Event not found.</div>;

    return (
        <>
            {showToast && <Toast message="Invite Sent" />}
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
                            className="flex items-center gap-2 mb-4 bg-gray-200 px-3 py-1 rounded cursor-pointer"
                            onClick={() => navigate(from)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                                />
                            </svg>
                            Back
                        </button>
                        <h1 className="text-xl font-bold mb-2">
                            {event.title}
                        </h1>
                        {event.description ? (
                            <div className="mb-4">{event.description}</div>
                        ) : (
                            <div className="text-gray-500 py-2 text-center mb-4">
                                No event description
                            </div>
                        )}
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
                        <div className="flex gap-2 items-center mt-6 mb-2">
                            <h2 className="text-lg font-bold">Participants</h2>
                            {event.hostId === auth?.user?.id && (
                                <button
                                    className="bg-cyan-600 text-white px-3 py-1 rounded font-medium hover:bg-cyan-400 cursor-pointer"
                                    onClick={() =>
                                        navigate(`/invite-form/${eventId}`)
                                    }
                                >
                                    Invite
                                </button>
                            )}
                        </div>
                        <div className="space-y-2">
                            {event.participants.map((name, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2"
                                >
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
                </div>
            </div>
        </>
    );
}
