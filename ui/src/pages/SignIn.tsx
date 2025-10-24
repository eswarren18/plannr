import { useState, useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { signin } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      <button type="submit">Sign In</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}

export default SignIn;
