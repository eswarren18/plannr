import { useState, useContext, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { AuthContext } from '../providers/AuthProvider';
import {
    createEvent,
    fetchEventById,
    updateEvent,
} from '../services/eventService';

export default function EventForm() {
    // Redirect to home if not logged in
    const auth = useContext(AuthContext);
    if (!auth?.user) {
        return <Navigate to="/" />;
    }

    // Component state and navigation
    const { eventId } = useParams<{ eventId?: string }>();
    const isEdit = !!eventId;
    const [form, setForm] = useState({
        title: '',
        description: '',
        startTime: null as Date | null,
        endTime: null as Date | null,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(isEdit);
    const navigate = useNavigate();

    // Fetch event for editing
    const fetchEvent = async () => {
        if (isEdit && eventId) {
            setLoading(true);
            const result = await fetchEventById(Number(eventId));
            if (result instanceof Error) {
                setError(result.message);
            } else {
                setForm({
                    title: result.title ?? '',
                    description: result.description ?? '',
                    startTime: result.startTime
                        ? new Date(result.startTime)
                        : null,
                    endTime: result.endTime ? new Date(result.endTime) : null,
                });
            }
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validate submission data
        if (!form.title) {
            setError('Please enter a title');
            return;
        }
        if (!form.startTime || !form.endTime) {
            setError('Please select start and end times');
            return;
        }

        try {
            const payload = {
                title: form.title,
                description: form.description,
                hostId: auth.user!.id,
                startTime: form.startTime.toISOString(),
                endTime: form.endTime.toISOString(),
            };
            if (isEdit && eventId) {
                // Update event
                const result = await updateEvent(Number(eventId), payload);
                if (result instanceof Error) {
                    setError(result.message);
                } else {
                    navigate(`/events/${eventId}`);
                }
            } else {
                // Create event
                const result = await createEvent(payload);
                console.log('From EventForm:', result);
                if (result instanceof Error) {
                    setError(
                        'Unknown error occurred while creating event. Please try again.'
                    );
                } else {
                    navigate(`/events/${result.id}`);
                }
            }
        } catch (error) {
            setError(
                'Unknown error occurred while creating event. Please try again.'
            );
        }
    };

    // Run the fetchEvent function on component mount or when dependencies change
    useEffect(() => {
        fetchEvent();
    }, [isEdit, eventId]);

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col w-5/6 sm:w-3/5 md:w-2/5 lg:w-1/5 mx-auto my-8"
        >
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
                {isEdit ? 'Edit Event' : 'Create an Event!'}
            </h1>
            <p className="text-sm font-normal text-gray-600 mb-4">
                Event Details
            </p>
            <div className="flex items-center border-2 py-2 px-3 rounded mb-3 text-gray-800">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-800"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                    />
                </svg>
                <input
                    autoComplete="title"
                    className="pl-2 outline-none border-none w-full text-gray-800 placeholder-gray-400"
                    id="title"
                    name="title"
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Title*"
                    type="text"
                    value={form.title}
                    disabled={loading}
                />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded text-gray-800 mb-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-800"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                    />
                </svg>
                <textarea
                    autoComplete="description"
                    className="pl-2 outline-none border-none w-full text-gray-800 placeholder-gray-400"
                    id="description"
                    maxLength={200}
                    name="description"
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Description"
                    value={form.description}
                    disabled={loading}
                ></textarea>
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded text-gray-800 mb-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5 text-gray-800 mr-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                </svg>
                <DatePicker
                    selected={form.startTime}
                    onChange={(date: Date | null) =>
                        setForm({ ...form, startTime: date })
                    }
                    showTimeSelect
                    timeFormat="h:mm aa"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full text-gray-800 placeholder-gray-400"
                    placeholderText="Start Time*"
                    disabled={loading}
                />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded text-gray-800 mb-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5 text-gray-800 mr-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                </svg>
                <DatePicker
                    selected={form.endTime}
                    onChange={(date: Date | null) =>
                        setForm({ ...form, endTime: date })
                    }
                    showTimeSelect
                    timeFormat="h:mm aa"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full text-gray-800 placeholder-gray-400"
                    placeholderText="End Time*"
                    disabled={loading}
                />
            </div>
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <div className="flex gap-4 mt-4">
                <button
                    type="button"
                    className="cursor-pointer basis-1/2 bg-gray-200 px-3 py-1 rounded text-gray-800 font-medium transition-colors duration-200 focus:outline-none hover:bg-gray-300"
                    onClick={() => navigate('/events')}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="cursor-pointer basis-1/2 bg-cyan-600 text-white px-3 py-1 rounded font-medium hover:bg-cyan-400"
                    disabled={loading}
                >
                    {isEdit ? 'Update Event' : 'Create Event'}
                </button>
            </div>
        </form>
    );
}
