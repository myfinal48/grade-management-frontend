import axios, {
    type AxiosError,
    type AxiosInstance,
    type InternalAxiosRequestConfig,
} from "axios"
import { getSession } from "next-auth/react"
import {getEnv} from "@/lib/env";

export const apiClient: AxiosInstance = axios.create({
    baseURL: getEnv().apiUrl,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})

apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const session = await getSession();
            if (session?.accessToken) {
                config.headers = config.headers ?? {};
                config.headers.Authorization = `Bearer ${session.accessToken}`;
            }
            return config;
        } catch (error) {
            return Promise.reject(
                error instanceof Error ? error : new Error("Request interceptor error")
            );
        }
    },
    (error: AxiosError) => {
        return Promise.reject(
            error instanceof Error ? error : new Error("Request error")
        );
    }
);

export interface ApiError extends Error {
    status?: number;
    data?: {
        messages?: { 
            error?: string;
            [key: string]: string | undefined;
        };
        message?: string;
        error?: string;
    };
}

export function getErrorMessage(error: ApiError, fallbackMessage: string): string {
    if (error?.data?.messages?.error) {
        return error.data.messages.error;
    }
    
    if (error?.data?.messages) {
        const messages = error.data.messages;
        const validationErrors = Object.keys(messages)
            .filter(key => key !== 'error' && messages[key])
            .map(key => messages[key])
            .filter(Boolean);
        
        if (validationErrors.length > 0) {
            return validationErrors.join(', ');
        }
    }
    
    if (error?.data?.message) {
        return error.data.message;
    }
    
    if (error?.data?.error) {
        return error.data.error;
    }
    
    return fallbackMessage;
}

apiClient.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (typeof window !== "undefined") {
            const status = error.response?.status;

            if (status === 401) {
                const err = new Error("Session expired") as ApiError;
                err.name = "SessionExpiredError";
                err.status = 401;
                window.location.href = `/login?error=session_expired`;
                return Promise.reject(err);
            }
            else if (status === 403) {
                const err = new Error("Unauthorized access") as ApiError;
                err.name = "UnauthorizedError";
                err.status = 403;
                window.location.href = `/unauthorized`;
                return Promise.reject(err);
            }
            else if (status === 500) {
                const err = new Error("Server error") as ApiError;
                err.name = "ServerError";
                err.status = 500;
                console.error("Server Error:", error);
                return Promise.reject(err);
            }

            if (!error.response) {
                const err = new Error("Network error") as ApiError;
                err.name = "NetworkError";
                console.error("Network Error:", error.message);
                return Promise.reject(err);
            }
        }

        const apiError = new Error(error.message || "API Error") as ApiError;
        apiError.status = error.response?.status;
        apiError.data = error.response?.data as { messages?: { error?: string }; message?: string };
        apiError.name = "ApiError";

        return Promise.reject(apiError);
    }
);