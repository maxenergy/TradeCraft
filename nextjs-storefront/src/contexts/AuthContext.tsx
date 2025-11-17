'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Using a lightweight JWT decoder

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null; // In a real app, you'd have a proper user type
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // On initial load, try to load token from storage
        const storedToken = localStorage.getItem('jwt');
        if (storedToken) {
            try {
                const decodedUser = jwtDecode(storedToken);
                setUser(decodedUser);
                setToken(storedToken);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Invalid token found in storage", error);
                logout(); // Clear invalid token
            }
        }
    }, []);

    const login = (newToken: string) => {
        try {
            const decodedUser = jwtDecode(newToken);
            localStorage.setItem('jwt', newToken);
            setUser(decodedUser);
            setToken(newToken);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Failed to decode token", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
