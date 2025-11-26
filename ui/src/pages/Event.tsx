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
import { fetchInvites } from '../services/inviteService';
import { EventOut } from '../types/event';
import { InviteOut } from '../types/invite';

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
    const [event, setEvent] = useState<EventOut | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [invites, setInvites] = useState<InviteOut[]>([]);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<
        'all' | 'accepted' | 'declined' | 'pending'
    >('accepted');

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
        }
    }

    // Fetch invites for the event and selected status
    async function fetchInviteList(
        status: 'all' | 'accepted' | 'declined' | 'pending'
    ) {
        setInviteError(null);
        try {
            const data = await fetchInvites(status, Number(eventId));
            setInvites(data);
        } catch (err) {
            setInviteError('Failed to load invites');
        }
    }

    // Run the fetchData function on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch invites when eventId or selectedStatus changes (for host and non-host)
    useEffect(() => {
        if (event) {
            if (event.hostId === auth?.user?.id) {
                fetchInviteList(selectedStatus);
            } else {
                // For non-hosts, always fetch accepted invites
                fetchInviteList('accepted');
            }
        }
    }, [event, selectedStatus, auth?.user?.id]);

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
                    <div className="flex w-4/5 mx-auto items-start">
                        <div className="flex w-1/3 mx-4">
                            {/* TODO: Placeholder for event image */}
                            <div className="w-full h-72 bg-gray-200 rounded-2xl"></div>
                        </div>
                        <div className="flex w-2/3 flex-col mt-4 mb-6">
                            <h1 className="text-2xl font-bold mb-2">
                                {event.title}
                            </h1>
                            {event.description ? (
                                <div className="mb-8">{event.description}</div>
                            ) : (
                                <div className="text-gray-500 py-2 text-center mb-4">
                                    No event description
                                </div>
                            )}
                            <div className="flex items-center gap-2 mb-2">
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
                                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                                    />
                                </svg>
                                <div className="text-lg text-red-400">
                                    Placeholder Time
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mb-8">
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
                                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                    />
                                </svg>

                                <div className="text-lg text-red-400">
                                    Placeholder Location
                                </div>
                            </div>
                            <h2 className="text-lg font-bold mb-2">Host</h2>
                            <div className="flex items-center gap-2 w-auto mb-8">
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
                                <span>{event.hostName}</span>
                            </div>

                            <h2 className="text-lg font-bold mb-2">
                                Participants
                            </h2>
                            {/* Host-only invite status toggle and invite list */}
                            {event.hostId === auth?.user?.id && (
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex gap-2">
                                            {[
                                                'accepted',
                                                'declined',
                                                'pending',
                                                'all',
                                            ].map((status) => (
                                                <button
                                                    key={status}
                                                    className={`px-3 py-1 rounded font-medium ${selectedStatus === status ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-black'}`}
                                                    onClick={() =>
                                                        setSelectedStatus(
                                                            status as typeof selectedStatus
                                                        )
                                                    }
                                                >
                                                    {status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        status.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            className="bg-cyan-600 text-white px-3 py-1 rounded font-medium hover:bg-cyan-400 cursor-pointer"
                                            onClick={() =>
                                                navigate(
                                                    `/invite-form/${eventId}`
                                                )
                                            }
                                        >
                                            Invite
                                        </button>
                                    </div>
                                    {inviteError ? (
                                        <div className="text-red-500">
                                            {inviteError}
                                        </div>
                                    ) : invites.length === 0 ? (
                                        <div>No invites found.</div>
                                    ) : (
                                        <table className="w-full bg-white rounded-lg shadow-sm">
                                            <thead>
                                                <tr className="bg-gray-100 text-left">
                                                    <th className="py-2 px-4">
                                                        Name
                                                    </th>
                                                    <th className="py-2 px-4">
                                                        Role
                                                    </th>
                                                    <th className="py-2 px-4">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invites.map((invite) => (
                                                    <tr
                                                        key={invite.id}
                                                        className="border-b last:border-b-0 border-gray-200"
                                                    >
                                                        <td className="py-2 px-4">
                                                            {invite.user_name}
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            {invite.role}
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            {selectedStatus ===
                                                            'all'
                                                                ? (invite.status ??
                                                                  '')
                                                                : selectedStatus}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}
                            {/* Participant list for non-hosts */}
                            {event.hostId !== auth?.user?.id && (
                                <div className="space-y-2">
                                    {inviteError ? (
                                        <div className="text-red-500">
                                            {inviteError}
                                        </div>
                                    ) : invites.length === 0 ? (
                                        <div>
                                            No accepted participants found.
                                        </div>
                                    ) : (
                                        invites.map((invite, idx) => (
                                            <div
                                                key={invite.id || idx}
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
                                                <span>{invite.user_name}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
