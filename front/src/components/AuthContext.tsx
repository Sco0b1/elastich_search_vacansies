'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    currentUser: { email: string; name: string } | null;
    loading: boolean;
    login: (email: string, name: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Синхронно читаем данные из localStorage для начального состояния
const getInitialAuthState = () => {
    if (typeof window === 'undefined') {
        return {
            isAuthenticated: false,
            currentUser: null,
        };
    }
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const userEmail = localStorage.getItem('currentUser');
    if (authStatus && userEmail) {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const user = users[userEmail];
        if (user) {
            return {
                isAuthenticated: true,
                currentUser: { email: user.email, name: user.name },
            };
        }
    }
    return {
        isAuthenticated: false,
        currentUser: null,
    };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        getInitialAuthState().isAuthenticated
    );
    const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(
        getInitialAuthState().currentUser
    );
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (typeof window === 'undefined') {
            setLoading(false);
            return;
        }
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        const userEmail = localStorage.getItem('currentUser');
        if (authStatus && userEmail) {
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            const user = users[userEmail];
            if (user) {
                setIsAuthenticated(true);
                setCurrentUser({ email: user.email, name: user.name });
            } else {
                setIsAuthenticated(false);
                setCurrentUser(null);
            }
        } else {
            setIsAuthenticated(false);
            setCurrentUser(null);
        }
        setLoading(false);
    }, []);

    const login = (email: string, name: string) => {
        setIsAuthenticated(true);
        setCurrentUser({ email, name });
    };

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('currentUser');
        }
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, currentUser, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};