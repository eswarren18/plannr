import { useContext, useEffect, useState } from 'react';
import {
    useLocation,
    useParams,
    useNavigate,
    Navigate,
} from 'react-router-dom';

import {
    Chat,
    ConfirmDelete,
    EventInvites,
    EventParticipants,
    Faq,
    InviteSentToast,
    Itinerary,
    Packing,
    Polls,
    ProfileCard,
} from '../components';
import { AuthContext } from '../providers/AuthProvider';
import { deleteEvent, fetchEventById } from '../services/eventService';
import { EventOut } from '../types/event';

export default function Event() {
    // Redirect to home if not logged in
    const auth = useContext(AuthContext);
    if (!auth?.user) {
        return <Navigate to="/" />;
    }

    // Page state and navigation
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const showInviteSentToast = location.state?.showInviteSentToast;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [event, setEvent] = useState<EventOut | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [featureSelection, setFeatureSelection] = useState<
        | 'participants'
        | 'invites'
        | 'faq'
        | 'chat'
        | 'packing'
        | 'itinerary'
        | 'polls'
    >('participants');

    // Fetch event details
    async function fetchEventData() {
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

    // handle event deletion
    async function handleDeleteEvent() {
        if (!event) {
            console.error('No event to delete.');
            return;
        }
        try {
            const result = await deleteEvent(event.id);
            if (result === true) {
                setShowDeleteDialog(false);
                navigate('/events');
            } else {
                console.error('Failed to delete event.');
            }
        } catch (err) {
            console.error('Error deleting event:', err);
        }
    }

    // Run the fetchData function on component mount
    useEffect(() => {
        fetchEventData();
    }, []);

    // TODO: clean this up
    if (error) return <div>{error}</div>;
    if (!event) return <div>Event not found.</div>;

    // Format start and end times to display
    const formattedStart = event.startTime
        ? new Date(event.startTime).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
          })
        : '';
    const formattedEnd = event.endTime
        ? new Date(event.endTime).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
          })
        : '';

    return (
        <>
            {showInviteSentToast && <InviteSentToast message="Invite Sent" />}
            <div className="flex bg-gray-50 min-h-screen z-10">
                <ProfileCard />
                {/* Event content */}
                <div
                    className="fixed right-0 w-3/4 pt-20 pb-8 flex flex-col items-center overflow-y-auto"
                    style={{
                        height: 'calc(100vh - 4rem)',
                        maxHeight: 'calc(100vh - 4rem)',
                    }}
                >
                    {/* Image and summary */}
                    <div className="flex w-4/5 gap-4 items-start">
                        {/* Image */}
                        <div className="flex w-1/3">
                            <div className="w-full h-72 bg-gray-200 rounded-2xl"></div>
                        </div>
                        {/* Summary: title, description, datetime, location, host */}
                        <div className="flex w-2/3 flex-col mt-4 mb-6">
                            {/* Title */}
                            <div className="flex items-center mb-2">
                                <h1 className="text-2xl font-bold mr-6">
                                    {event.title}
                                </h1>
                                {event.hostId === auth?.user?.id && (
                                    <>
                                        <button
                                            title="Edit Event"
                                            className="rounded hover:bg-cyan-200 hover:text-cyan-800 p-1"
                                            onClick={() =>
                                                navigate(
                                                    `/event-form/${event.id}`
                                                )
                                            }
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
                                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            title="Delete Event"
                                            className="rounded hover:bg-cyan-200 hover:text-cyan-800 p-1"
                                            onClick={() =>
                                                setShowDeleteDialog(true)
                                            }
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
                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                            {/* Description */}
                            {event.description ? (
                                <div className="mb-6">{event.description}</div>
                            ) : (
                                <div className="text-gray-500 py-2 mb-4">
                                    No event description
                                </div>
                            )}
                            {/* Datetime */}
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
                                <div className="text-lg">
                                    {event?.startTime
                                        ? new Date(
                                              event.startTime
                                          ).toLocaleString('en-US', {
                                              dateStyle: 'medium',
                                              timeStyle: 'short',
                                          })
                                        : ''}
                                    {' - '}
                                    {event?.endTime
                                        ? new Date(
                                              event.endTime
                                          ).toLocaleString('en-US', {
                                              dateStyle: 'medium',
                                              timeStyle: 'short',
                                          })
                                        : ''}
                                </div>
                            </div>
                            {/* Location */}
                            <div className="flex items-center gap-2 mb-6">
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
                            {/* Host */}
                            <h2 className="text-lg font-bold">Host</h2>
                            <div className="flex items-center gap-2 w-auto mb-6">
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
                        </div>
                    </div>
                    {/* Event Features */}
                    <div className="flex flex-col w-4/5 mt-8 mb-6">
                        <div className="w-full border border-gray-200 mb-4" />
                        <div className="flex gap-4 mb-4">
                            {/* Participants */}
                            <div>
                                <button
                                    className={`w-16 h-16 rounded-full transition-colors duration-200 cursor-pointer ${featureSelection === 'participants' ? 'bg-indigo-600' : 'bg-indigo-300'} ${featureSelection !== 'participants' ? 'hover:bg-indigo-600' : ''}`}
                                    onClick={() =>
                                        setFeatureSelection('participants')
                                    }
                                />
                                <div className="text-xs text-center">
                                    Participants
                                </div>
                            </div>
                            {/* Invites */}
                            {event.hostId === auth?.user?.id && (
                                <div>
                                    <button
                                        className={`w-16 h-16 rounded-full transition-colors duration-200 cursor-pointer ${featureSelection === 'invites' ? 'bg-indigo-600' : 'bg-indigo-300'} ${featureSelection !== 'invites' ? 'hover:bg-indigo-600' : ''}`}
                                        onClick={() =>
                                            setFeatureSelection('invites')
                                        }
                                    />
                                    <div className="text-xs text-center">
                                        Invites
                                    </div>
                                </div>
                            )}
                            {/* FAQ */}
                            <div>
                                <button
                                    className={`w-16 h-16 rounded-full transition-colors duration-200 cursor-pointer ${featureSelection === 'faq' ? 'bg-indigo-600' : 'bg-indigo-300'} ${featureSelection !== 'faq' ? 'hover:bg-indigo-600' : ''}`}
                                    onClick={() => setFeatureSelection('faq')}
                                />
                                <div className="text-xs text-center">FAQ</div>
                            </div>
                            {/* Chat */}
                            <div>
                                <button
                                    className={`w-16 h-16 rounded-full transition-colors duration-200 cursor-pointer ${featureSelection === 'chat' ? 'bg-indigo-600' : 'bg-indigo-300'} ${featureSelection !== 'chat' ? 'hover:bg-indigo-600' : ''}`}
                                    onClick={() => setFeatureSelection('chat')}
                                />
                                <div className="text-xs text-center">Chat</div>
                            </div>
                            {/* Packing */}
                            <div>
                                <button
                                    className={`w-16 h-16 rounded-full transition-colors duration-200 cursor-pointer ${featureSelection === 'packing' ? 'bg-indigo-600' : 'bg-indigo-300'} ${featureSelection !== 'packing' ? 'hover:bg-indigo-600' : ''}`}
                                    onClick={() =>
                                        setFeatureSelection('packing')
                                    }
                                />
                                <div className="text-xs text-center">
                                    Packing
                                </div>
                            </div>
                            {/* Itinerary */}
                            <div>
                                <button
                                    className={`w-16 h-16 rounded-full transition-colors duration-200 cursor-pointer ${featureSelection === 'itinerary' ? 'bg-indigo-600' : 'bg-indigo-300'} ${featureSelection !== 'itinerary' ? 'hover:bg-indigo-600' : ''}`}
                                    onClick={() =>
                                        setFeatureSelection('itinerary')
                                    }
                                />
                                <div className="text-xs text-center">
                                    Itinerary
                                </div>
                            </div>
                            {/* Polls */}
                            <div>
                                <button
                                    className={`w-16 h-16 rounded-full transition-colors duration-200 cursor-pointer ${featureSelection === 'polls' ? 'bg-indigo-600' : 'bg-indigo-300'} ${featureSelection !== 'polls' ? 'hover:bg-indigo-600' : ''}`}
                                    onClick={() => setFeatureSelection('polls')}
                                />
                                <div className="text-xs text-center">Polls</div>
                            </div>
                        </div>
                        <div className="w-full border border-gray-200" />
                    </div>
                    {/* Event feature displays */}
                    {featureSelection === 'participants' && (
                        <EventParticipants eventId={eventId} />
                    )}
                    {/* Render EventInvites if selected */}
                    {featureSelection === 'invites' &&
                        event.hostId === auth?.user?.id && (
                            <EventInvites eventId={eventId} />
                        )}
                    {featureSelection === 'faq' && <Faq />}
                    {featureSelection === 'chat' && <Chat />}
                    {featureSelection === 'packing' && <Packing />}
                    {featureSelection === 'itinerary' && <Itinerary />}
                    {featureSelection === 'polls' && <Polls />}
                </div>
            </div>
            {/* ConfirmDialog for delete */}
            <ConfirmDelete
                open={showDeleteDialog}
                title="Delete Event?"
                message="Are you sure you want to delete this event? This action cannot be undone."
                confirmText={'Delete'}
                cancelText="Cancel"
                onConfirm={handleDeleteEvent}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </>
    );
}
