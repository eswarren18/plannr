
import { createContext, useEffect, useState, ReactNode } from 'react';
import { authenticate, signout as signoutApi } from '../services/authService';
import LoadingIcon from '../components/LoadingIcon';

interface AuthContextType {
    user: any;
    setUser: (user: any) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: any;
    setError: (error: any) => void;
    isLoggedIn: boolean;
    signout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>();
    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        authenticate().then((result) => {
            if (result instanceof Error) {
                setUser(undefined);
                setIsLoading(false);
                return;
            }
            setUser(result);
            setIsLoading(false);
        });
    }, []);

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
