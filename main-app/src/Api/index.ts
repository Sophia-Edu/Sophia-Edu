import axios, { AxiosHeaders } from "axios";
import { getStoredAuthToken, removeStoredAuthToken } from "../utils/storage";
// import io from "socket.io-client";
// Use a relative base path so it can be proxied in dev and mapped in prod
export const baseurl = "/api";
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
        request.headers = {
            ...(request.headers as AxiosHeaders),
            ...(shouldAttachAuth && getStoredAuthToken()
                ? { Authorization: `Bearer ${getStoredAuthToken()}` }
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
