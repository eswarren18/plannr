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
                    <button
                        className="cursor-pointer font-semibold text-lg px-3 py-1 rounded-xl bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        disabled={location.pathname === '/'}
                    >
                        Plannr
                    </button>
                </Link>
                <div className="relative group flex items-align">
                    <button
                        className="cursor-pointer font-medium px-3 py-1 rounded-xl bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 flex items-center"
                        type="button"
                    >
                        Dashboard
                        <svg
                            className="ml-2 w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors duration-150"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-150 z-50">
                        <ul className="py-2">
                            <li>
                                <Link to="/dashboard">
                                    <span
                                        className={`block px-4 py-2 cursor-pointer hover:bg-gray-100 ${location.pathname === '/dashboard' ? 'font-bold text-cyan-600' : 'text-gray-700'}`}
                                    >
                                        Dashboard
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/participating-events">
                                    <span
                                        className={`block px-4 py-2 cursor-pointer hover:bg-gray-100 ${location.pathname === '/participating-events' ? 'font-bold text-cyan-600' : 'text-gray-700'}`}
                                    >
                                        Upcoming Events
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/hosting-events">
                                    <span
                                        className={`block px-4 py-2 cursor-pointer hover:bg-gray-100 ${location.pathname === '/hosting-events' ? 'font-bold text-cyan-600' : 'text-gray-700'}`}
                                    >
                                        My Events
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/invites">
                                    <span
                                        className={`block px-4 py-2 cursor-pointer hover:bg-gray-100 ${location.pathname === '/invites' ? 'font-bold text-cyan-600' : 'text-gray-700'}`}
                                    >
                                        My Invitations
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="ml-auto flex gap-4">
                {!user ? (
                    <>
                        <Link to="/signup">
                            <button
                                className="cursor-pointer basis-1/2 bg-gray-200 px-3 py-1 rounded text-gray-800 font-medium transition-colors duration-200 focus:outline-none hover:bg-gray-300"
                                disabled={location.pathname === '/signup'}
                            >
                                Sign Up
                            </button>
                        </Link>
                        <Link to="/signin">
                            <button
                                className="cursor-pointer basis-1/2 bg-cyan-600 text-white px-3 py-1 rounded font-medium hover:bg-cyan-400"
                                disabled={location.pathname === '/signin'}
                            >
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
                        <button
                            className="cursor-pointer bg-cyan-600 text-white px-3 py-1 rounded font-medium hover:bg-cyan-400 transition"
                            onClick={signout}
                        >
                            Sign Out
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Nav;
