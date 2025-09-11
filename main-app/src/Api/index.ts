import axios, { AxiosHeaders } from "axios";
import { getStoredAuthToken, removeStoredAuthToken } from "../utils/storage";
// import io from "socket.io-client";
// Use a relative base path so it can be proxied in dev and mapped in prod.
// For production builds you can set VITE_API_BASE in your environment and
// the dev server will proxy /api to that target when running `npm run dev`.
export const baseurl = (import.meta.env.VITE_API_BASE as string) || "/api";
// export const socket = io(baseurl);
const api = axios.create({
    baseURL: `${baseurl}`,
});

api.interceptors.request.use(
    (request: any) => {
        // Avoid attaching Authorization to public auth endpoints
        const unauthenticatedPaths = [
            '/login',
            '/register',
            '/reactivate',
            '/admin/login',
            '/instructor/login',
            '/password/forgot',
            '/password/reset',
            '/auth/password/forgot',
            '/auth/password/reset',
        ];
        const url = String(request?.url || '');

        const shouldAttachAuth = !unauthenticatedPaths.some((p) => url.includes(p));

        // Cast request.headers to AxiosHeaders
        // Pull token from cookies first, fall back to localStorage if needed (for older login flows)
        let token: string | null = null;
        try {
            token = getStoredAuthToken();
            if (!token && typeof window !== 'undefined') {
                const ls = window.localStorage?.getItem('token');
                if (ls && typeof ls === 'string' && ls.trim().length > 0) {
                    token = ls.trim();
                }
            }
        } catch (_) {
            // non-fatal
        }

        request.headers = {
            ...(request.headers as AxiosHeaders),
            ...(shouldAttachAuth && token
                ? { Authorization: `Bearer ${token}` }
                : {}),
        };
        return request;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: any) => {
        // console.log("response received");
        // remove course category metadata from subjects_for_follow responses
        try {
            const url = String(response?.config?.url || "");
            if (url.includes("/subjects_for_follow")) {
                const d = response?.data;
                // If backend returns an envelope { flat: [...] }, unwrap it for consumers expecting an array
                if (d && typeof d === "object" && Array.isArray((d as any).flat)) {
                    response.data = (d as any).flat;
                }
                // Sanitize array items by removing course category metadata (subjects endpoint)
                const current = response?.data;
                if (Array.isArray(current)) {
                    response.data = current.map((item: any) => {
                        if (item && typeof item === "object") {
                            const copy = { ...item };
                            delete (copy as any).course_category;
                            delete (copy as any).courseCategory;
                            return copy;
                        }
                        return item;
                    });
                } else if (current && typeof current === "object") {
                    const copy = { ...current };
                    delete (copy as any).course_category;
                    delete (copy as any).courseCategory;
                    response.data = copy;
                }
            }
        } catch (e) {
            // non-fatal: if sanitizer fails, allow original response through
            // console.warn('subjects_for_follow sanitizer error', e);
        }
        if (response?.data?.token) {
            // console.log(getStoredAuthToken());
        }
        return response.data;
    },
    (error: any) => {
        // Clear any cached tokens only on unauthorized responses
        if (error?.response?.status === 401 || error?.response?.data?.authStatus === 401) {
            removeStoredAuthToken();
        }
        return Promise.reject(error);
    }
);

export default api;
