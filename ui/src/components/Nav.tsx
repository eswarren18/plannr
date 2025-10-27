import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';

function Nav() {
  const auth = useContext(AuthContext);

  const user = auth?.user;
  const signout = auth?.signout;

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #eee' }}>
      <Link to="/">Home</Link>
      {!user ? (
        <>
          <Link to="/signup">Sign Up</Link>
          <Link to="/signin">Sign In</Link>
        </>
      ) : (
        <button onClick={signout}>Sign Out</button>
      )}
    </nav>
  );
}

export default Nav;
