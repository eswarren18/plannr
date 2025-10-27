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
        <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
            />
            <input
                name="firstName"
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
            />
            <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
            />
            <button type="submit">Sign Up</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
    );
}
