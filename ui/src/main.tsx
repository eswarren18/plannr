
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import AuthProvider from './providers/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Welcome />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="signin" element={<SignIn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
