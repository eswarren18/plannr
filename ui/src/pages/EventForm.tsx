import { useState, useContext, useEffect } from 'react';
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

    // State for form data, error messages, and loading status
    const { eventId } = useParams<{ eventId?: string }>();
    const isEdit = !!eventId;
    const [form, setForm] = useState({ title: '', description: '' });
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
                });
            }
            setLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!form.title) {
            setError('Please enter a title');
            return;
        }
        setError('');
        if (isEdit && eventId) {
            // Update event
            const result = await updateEvent(Number(eventId), {
                title: form.title,
                description: form.description,
            });
            if (result instanceof Error) {
                setError(result.message);
            } else {
                navigate('/hosting-events');
            }
        } else {
            // Create event
            const result = await createEvent({
                title: form.title,
                description: form.description,
            });
            if (result instanceof Error) {
                setError(result.message);
            } else {
                navigate('/hosting-events');
            }
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [isEdit, eventId]);

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col w-5/6 sm:w-3/5 md:w-2/5 lg:w-1/5 mx-auto my-2"
        >
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
                {isEdit ? 'Edit Event' : 'Create an Event!'}
            </h1>
            <p className="text-sm font-normal text-gray-600 mb-4">
                Event Details
            </p>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
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
                    className="pl-2 outline-none border-none w-full"
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
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
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
                    className="pl-2 outline-none border-none w-full"
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
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <div className="flex gap-4 mt-4">
                <button
                    type="button"
                    className="flex-1 bg-gray-200 py-2 rounded-2xl text-gray-800 font-semibold transition-colors duration-200 focus:outline-none hover:bg-gray-300 cursor-pointer"
                    onClick={() => navigate('/hosting-events')}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 bg-cyan-600 py-2 rounded-2xl text-white font-semibold transition-colors duration-200 focus:outline-none hover:bg-cyan-400 hover:ring-2 hover:ring-cyan-300 active:bg-cyan-200 active:ring-4 active:ring-cyan-100 cursor-pointer"
                    disabled={loading}
                >
                    {isEdit ? 'Update Event' : 'Create Event'}
                </button>
            </div>
        </form>
    );
}
