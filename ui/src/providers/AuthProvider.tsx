import { createContext, useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { UserResponse } from '../types/user';
import { authenticate, signout as signoutApi } from '../services/authService';
import LoadingIcon from '../components/LoadingIcon';

interface AuthContextType {
    user: UserResponse | undefined;
    setUser: (user: UserResponse | undefined) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: any;
    setError: (error: any) => void;
    isLoggedIn: boolean;
    signout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserResponse | undefined>();
    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    // Authenticate on initial mount and on every route change
    useEffect(() => {
        setIsLoading(true);
        authenticate().then((result) => {
            if (result instanceof Error) {
                setUser(undefined);
                setIsLoading(false);
                return;
            }
            setUser(result);
            setIsLoading(false);
        });
    }, [location]);

    const signout = async () => {
        await signoutApi();
        setUser(undefined);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoading,
                setIsLoading,
                error,
                setError,
                isLoggedIn: !!user,
                signout,
            }}
        >
            {isLoading ? <LoadingIcon /> : children}
        </AuthContext.Provider>
    );
}
