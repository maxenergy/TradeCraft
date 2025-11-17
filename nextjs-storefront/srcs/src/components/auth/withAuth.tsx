'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import React, { ComponentType, useEffect } from 'react';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const WithAuthComponent = (props: P) => {
        const { isAuthenticated } = useAuth();
        const router = useRouter();

        useEffect(() => {
            // Also check on client-side navigation
            if (!isAuthenticated) {
                router.push('/login');
            }
        }, [isAuthenticated, router]);

        // Initial check on server or first render
        if (!isAuthenticated) {
            // You can return a loader here while redirecting
            return <div>Loading...</div>;
        }

        return <WrappedComponent {...props} />;
    };

    return WithAuthComponent;
};

export default withAuth;
