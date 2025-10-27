import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';

function Nav() {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const signout = auth?.signout;
    const location = useLocation();

    return (
        <nav
            style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                borderBottom: '1px solid #eee',
            }}
        >
            <Link to="/">
                <button disabled={location.pathname === '/'}>Home</button>
            </Link>
            {!user ? (
                <>
                    <Link to="/signup">
                        <button disabled={location.pathname === '/signup'}>
                            Sign Up
                        </button>
                    </Link>
                    <Link to="/signin">
                        <button disabled={location.pathname === '/signin'}>
                            Sign In
                        </button>
                    </Link>
                </>
            ) : (
                <button onClick={signout}>Sign Out</button>
            )}
        </nav>
    );
}

export default Nav;
