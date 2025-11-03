
const base = import.meta?.env?.VITE_DEFAULT_API_URL || 'http://localhost:8080';

export const checkAuthToken = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${base}/v1/auth/verify`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.ok;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
};

export const getVKAuthUrl = (): string => {
    return `${base}/v1/auth/vk`;
};
