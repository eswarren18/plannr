import { useState, useContext } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { AuthContext } from '../providers/AuthProvider';
import { createInvite } from '../services/inviteService';

export default function InviteForm() {
    // Redirect to home if not logged in
    const auth = useContext(AuthContext);
    if (!auth?.user) {
        return <Navigate to="/" />;
    }

    // Component state and navigation
    const { eventId } = useParams<{ eventId?: string }>();
    const isEdit = !!eventId;
    const [form, setForm] = useState({ email: '', role: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validate submission data
        if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
            setError('Please enter a valid email address');
            return;
        }
        if (!form.role) {
            setError('Please select a role');
            return;
        }

        // Submit POST request to the API
        try {
            const result = await createInvite(Number(eventId), {
                email: form.email,
                role: form.role,
            });
            if (result instanceof Error) {
                setError(
                    'Unknown error occurred while creating invite. Please try again.'
                );
            } else {
                navigate(`/events/${eventId}`, {
                    state: { showInviteSentToast: true },
                });
            }
        } catch (error) {
            setError(
                'Unknown error occurred while creating invite. Please try again.'
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col w-5/6 sm:w-3/5 md:w-2/5 lg:w-1/5 mx-auto my-8"
        >
            <h1 className="font-bold text-2xl mb-1">Invite a friend!</h1>
            <p className="text-sm font-normal text-gray-600 mb-4">
                Invite Details
            </p>
            <div className="flex items-center border-2 py-2 px-3 rounded mb-3">
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
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                </svg>
                <input
                    autoComplete="email"
                    className="pl-2 outline-none border-none w-full placeholder-gray-400"
                    id="email"
                    name="email"
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                    placeholder="Email*"
                    type="text"
                    value={form.email}
                />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded">
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
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                </svg>
                <select
                    autoComplete="role"
                    id="role"
                    name="role"
                    className="outline-none border-none w-full pl-1"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                    <option value="" disabled hidden>
                        Role*
                    </option>
                    <option value="host">Host</option>
                    <option value="participant">Participant</option>
                </select>
            </div>
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <div className="flex gap-4 mt-4">
                <button
                    type="button"
                    className="cursor-pointer basis-1/2 bg-gray-200 px-3 py-1 rounded font-medium transition-colors duration-200 focus:outline-none hover:bg-gray-300"
                    onClick={() => navigate(`/events/${eventId}`)}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="cursor-pointer basis-1/2 bg-cyan-600 text-white px-3 py-1 rounded font-medium hover:bg-cyan-400"
                >
                    Invite
                </button>
            </div>
        </form>
    );
}
