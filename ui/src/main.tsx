import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './providers/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Dashboard, Event, Events, Home, Invites } from './pages';
import { EventForm, InviteForm, SignIn, SignUp } from './forms';

createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route index element={<Home />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="signup" element={<SignUp />} />
                        <Route path="signin" element={<SignIn />} />
                        <Route path="events" element={<Events />} />
                        <Route path="events/create" element={<EventForm />} />
                        <Route
                            path="events/edit/:eventId"
                            element={<EventForm />}
                        />
                        <Route path="events/:eventId" element={<Event />} />
                        <Route path="invites" element={<Invites />} />
                        <Route
                            path="invite-form/:eventId"
                            element={<InviteForm />}
                        />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
