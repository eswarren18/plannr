import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const auth = useContext(AuthContext);
  if (!auth?.user) {
    return <Navigate to="/" />;
  }
  return <h1>Welcome {auth.user.firstName || auth.user.first_name} to your dashboard</h1>;
}
