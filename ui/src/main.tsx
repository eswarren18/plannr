import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './providers/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import HostingEvents from './pages/HostingEvents';
import ParticipatingEvents from './pages/ParticipatingEvents';

createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route index element={<Home />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="signup" element={<SignUp />} />
                        <Route path="signin" element={<SignIn />} />
                        <Route
                            path="hosting-events"
                            element={<HostingEvents />}
                        />
                        <Route
                            path="participating-events"
                            element={<ParticipatingEvents />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
