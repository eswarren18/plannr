import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';

function Nav() {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const signout = auth?.signout;
    const location = useLocation();

    return (
        <nav className="flex gap-4 fixed w-full p-4 border-b border-gray-200 items-center z-50 bg-white">
            <div className="flex gap-4">
                <Link to="/">
                    <button disabled={location.pathname === '/'}>Home</button>
                </Link>
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
                    <>
                        <button
                            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center mr-2 hover:bg-gray-200"
                            title="Notifications"
                        >
                            {/* SVG placeholder */}
                            <span className="text-xl text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                                    />
                                </svg>
                            </span>
                        </button>
                        <button onClick={signout}>Sign Out</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Nav;
