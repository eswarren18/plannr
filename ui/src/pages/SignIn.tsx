import { useState, useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { signin } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate submission data
        if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
            setError('Please enter a valid email address');
            return;
        }
        if (!form.password) {
            setError('Please enter your password');
            return;
        }
        // TODO: require users to use strong passwords
        /*
        // Uncomment for strong password validation in production
        if (!form.password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)) {
            setError('Password must be at least 8 characters, include a number, a letter, and a special character.');
            return;
        }
        */

        // Submit signin request
        const result = await signin({
            email: form.email,
            password: form.password,
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
            className="flex flex-col w-1/5 mx-auto my-2"
        >
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
                Welcome Back!
            </h1>
            <p className="text-sm font-normal text-gray-600 mb-4">Sign In</p>
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
                    autoComplete="email"
                    className="pl-2 outline-none border-none w-full"
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
                <input
                    autoComplete="current-password"
                    className="pl-2 outline-none border-none w-full"
                    id="password"
                    name="password"
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Password*"
                    type="password"
                    value={form.password}
                />
            </div>
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <button
                type="submit"
                className="block w-full bg-cyan-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2 transition-colors duration-200 focus:outline-none hover:bg-cyan-400 hover:ring-2 hover:ring-cyan-300 active:bg-cyan-200 active:ring-4 active:ring-cyan-100"
            >
                Log In
            </button>
        </form>
    );
}
