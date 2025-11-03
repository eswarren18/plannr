import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';

function Nav() {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const signout = auth?.signout;
    const location = useLocation();

    return (
        <nav className="flex gap-4 p-4 border-b border-gray-200 items-center">
            <div className="flex gap-4">
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
            </div>
            <div className="ml-auto flex gap-4">
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
            </div>
        </nav>
    );
}

export default Nav;
