import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { Navigate } from 'react-router-dom';

function Welcome() {
  const auth = useContext(AuthContext);
  if (auth?.user) {
    return <Navigate to="/dashboard" />;
  }
  return <h1>Welcome to Plannr!</h1>;
}

export default Welcome;
