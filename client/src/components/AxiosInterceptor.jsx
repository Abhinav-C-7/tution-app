import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const AxiosInterceptor = ({ children }) => {
    const { getToken, isLoaded } = useAuth();
    const [isInterceptorSetup, setIsInterceptorSetup] = useState(false);

    useEffect(() => {
        if (!isLoaded) return;

        const interceptor = api.interceptors.request.use(
            async (config) => {
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        setIsInterceptorSetup(true);

        return () => {
            api.interceptors.request.eject(interceptor);
        };
    }, [getToken, isLoaded]);

    // Optionally, you can block rendering until the interceptor is set up
    // to prevent race conditions where initial requests go out without a token.
    if (!isLoaded || !isInterceptorSetup) {
        // You can return a loader here or just null
        // For now, returning null to avoid flashing unauthenticated content
        // or just return children if you want to risk it (but better safe)
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    return children;
};

export default AxiosInterceptor;
