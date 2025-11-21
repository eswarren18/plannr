import { useState, useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { signup } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
    const [error, setError] = useState('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate submission data
        if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
            setError('Please enter a valid email address');
            return;
        }
        if (!form.firstName) {
            setError('Please enter your first name');
            return;
        }
        if (!form.lastName) {
            setError('Please enter your last name');
            return;
        }
        if (!form.password) {
            setError('Please enter your password');
            return;
        }

        // TODO: require users to use strong passwords

        // Call authService signup
        const result = await signup({
            email: form.email,
            password: form.password,
            firstName: form.firstName,
            lastName: form.lastName,
        });
        if (result instanceof Error) {
            setError(result.message);
        } else {
            auth?.setUser(result);
            navigate('/dashboard');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col w-5/6 sm:w-3/5 md:w-2/5 lg:w-1/5 mx-auto my-2"
        >
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
                Create Account
            </h1>
            <p className="text-sm font-normal text-gray-600 mb-4">Sign Up</p>
            <div className="flex items-center border-2 py-2 px-3 rounded mb-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-gray-400"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                </svg>
                <input
                    autoComplete="email"
                    className="pl-2 outline-none border-none w-full"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Email*"
                    type="text"
                    value={form.email}
                />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded mb-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-gray-400"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                </svg>
                <input
                    autoComplete="given-name"
                    className="pl-2 outline-none border-none w-full"
                    id="firstName"
                    name="firstName"
                    onChange={handleChange}
                    placeholder="First Name*"
                    type="text"
                    value={form.firstName}
                />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded mb-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-gray-400"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                </svg>
                <input
                    autoComplete="family-name"
                    className="pl-2 outline-none border-none w-full"
                    id="lastName"
                    name="lastName"
                    onChange={handleChange}
                    placeholder="Last Name*"
                    type="text"
                    value={form.lastName}
                />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded mb-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-gray-400"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                </svg>
                <input
                    autoComplete="new-password"
                    className="pl-2 outline-none border-none w-full"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Password*"
                    type="password"
                    value={form.password}
                />
            </div>
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <div className="flex gap-4">
                <button
                    type="button"
                    className="basis-1/2 bg-gray-200 px-3 py-1 rounded text-gray-800 font-semibold transition-colors duration-200 focus:outline-none hover:bg-gray-300"
                    onClick={() => navigate('/')}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="basis-1/2 bg-cyan-600 text-white px-3 py-1 rounded font-semibold hover:bg-cyan-400"
                >
                    Sign Up
                </button>
            </div>
        </form>
    );
}
