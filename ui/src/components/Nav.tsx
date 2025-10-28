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
                alignItems: 'center',
            }}
        >
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/">
                    <button disabled={location.pathname === '/'}>Home</button>
                </Link>
                {user && (
                    <>
                        <Link to="/hosting-events">
                            <button
                                disabled={
                                    location.pathname === '/hosting-events'
                                }
                            >
                                Hosting
                            </button>
                        </Link>
                        <Link to="/participating-events">
                            <button
                                disabled={
                                    location.pathname ===
                                    '/participating-events'
                                }
                            >
                                Participating
                            </button>
                        </Link>
                    </>
                )}
                {!user && (
                    <>
                        <Link to="/signup">
                            <button disabled={location.pathname === '/signup'}>
                                Sign Up
                            </button>
                        </Link>
                    </>
                )}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                {!user ? (
                    <Link to="/signin">
                        <button disabled={location.pathname === '/signin'}>
                            Sign In
                        </button>
                    </Link>
                ) : (
                    <button onClick={signout}>Sign Out</button>
                )}
            </div>
        </nav>
    );
}

export default Nav;
