import { useContext, useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { Navigate } from 'react-router-dom';

import { fetchHostingEvents } from '../services/eventService';
import { fetchPendingInvites } from '../services/inviteService';
import { fetchParticipatingEvents } from '../services/eventService';
import { EventSummaryOut } from '../types/event';
import { InviteOut } from '../types/invite';

export default function Dashboard() {
    // Redirect to home if not logged in
    const auth = useContext(AuthContext);
    if (!auth?.user) {
        return <Navigate to="/" />;
    }

    const navigate = useNavigate();
    const [participatingEvents, setParticipatingEvents] = useState<
        EventSummaryOut[]
    >([]);
    const [hostingEvents, setHostingEvents] = useState<EventSummaryOut[]>([]);
    const [invites, setInvites] = useState<InviteOut[]>([]);

    // Fetch events and invites events
    const fetchData = async () => {
        try {
            const participatingData = await fetchParticipatingEvents();
            const hostingData = await fetchHostingEvents();
            const invitesData = await fetchPendingInvites();
            setParticipatingEvents(participatingData);
            setHostingEvents(hostingData);
            setInvites(invitesData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen z-10">
            {/* Left: Profile Card (fixed) */}
            <div className="w-1/4 h-screen fixed top-16 left-0 bg-white shadow-md flex flex-col items-center py-10 px-6">
                <div className="w-24 h-24 mb-4 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
                    {/* Placeholder for profile pic */}
                </div>
                <div className="text-lg font-semibold mb-1">
                    {auth.user.firstName} {auth.user.lastName}
                </div>
                <div className="text-gray-500 mb-4">{auth.user.email}</div>
                <button
                    className="bg-cyan-600 text-white px-3 py-1 rounded-xl font-medium hover:bg-cyan-400 transition"
                    onClick={() => {}}
                >
                    Edit Profile
                </button>
            </div>

            {/* Right: Main Content (scrollable) */}
            <div
                className="ml-[25vw] w-[75vw] pt-20 pb-8 flex flex-col items-center overflow-y-auto"
                style={{ maxHeight: 'calc(100vh - 2rem)' }}
            >
                <div className="flex flex-col w-4/5 gap-4">
                    {/* Upcoming Events */}
                    <section className="w-full mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold">
                                Upcoming Events
                            </h2>
                            <button
                                className="bg-cyan-600 text-white px-3 py-1 rounded-xl font-medium hover:bg-cyan-400 transition"
                                onClick={() =>
                                    navigate('/participating-events')
                                }
                            >
                                See All Events
                            </button>
                        </div>
                        {participatingEvents.length === 0 ? (
                            <div className="text-gray-500 py-4 text-center">
                                No upcoming events found.
                            </div>
                        ) : (
                            <table className="w-full bg-white rounded-lg shadow-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="py-2 px-4">Title</th>
                                        <th className="py-2 px-4">Host</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participatingEvents.map((event, idx) => (
                                        <tr
                                            key={event.id || idx}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="py-2 px-4">
                                                {event.title}
                                            </td>
                                            <td className="py-2 px-4">
                                                {event.hostName}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                    {/* My Events */}
                    <section className="w-full mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold">My Events</h2>
                            <button
                                className="bg-cyan-600 text-white px-3 py-1 rounded-xl font-medium hover:bg-cyan-400 transition"
                                onClick={() => navigate('/hosting-events')}
                            >
                                See All Events
                            </button>
                        </div>
                        {hostingEvents.length === 0 ? (
                            <div className="text-gray-500 py-4 text-center">
                                No hosted events found.
                            </div>
                        ) : (
                            <table className="w-full bg-white rounded-lg shadow-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="py-2 px-4">Title</th>
                                        <th className="py-2 px-4">Host</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hostingEvents.map((event, idx) => (
                                        <tr
                                            key={event.id || idx}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="py-2 px-4">
                                                {event.title}
                                            </td>
                                            <td className="py-2 px-4">
                                                {event.hostName}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                    {/* My Invites */}
                    <section className="w-full mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold">My Invites</h2>
                            <button
                                className="bg-cyan-600 text-white px-3 py-1 rounded-xl font-medium hover:bg-cyan-400 transition"
                                onClick={() => navigate('/invites')}
                            >
                                See All Invites
                            </button>
                        </div>
                        {invites.length === 0 ? (
                            <div className="text-gray-500 py-4">
                                No new invites.
                            </div>
                        ) : (
                            <table className="w-full bg-white rounded-lg shadow-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="py-2 px-4">Title</th>
                                        <th className="py-2 px-4">Host</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invites.map((invite, idx) => (
                                        <tr
                                            key={invite.id || idx}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="py-2 px-4">
                                                {invite.event.title}
                                            </td>
                                            <td className="py-2 px-4">
                                                {invite.event.hostName}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
