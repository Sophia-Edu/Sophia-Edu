import api from "../Api";

class AuthRequests {
    login = async (data: any) => {
        try {
            const response = await api.post(`/login`, data);
            return response;
        } catch (error: any) {
            // Extract the message or create a custom error message
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    register = async (data: any) => {
        try {
            const response = await api.post(`/register`, data);
            return response;
        } catch (error: any) {
            // Extract the message or create a custom error message
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    adminLogin = async (data: any) => {
        try {
            const response = await api.post(`/admin/login`, {...data, email: data.username});
            return response;
        } catch (error: any) {
            // Extract the message or create a custom error message
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };
    instructorLogin = async (data: any) => {
        try {
            const response = await api.post(`/instructor/login`, data);
            return response;
        } catch (error: any) {
            // Extract the message or create a custom error message
            console.log(error.response);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    changePassword = async (data: { current_password: string; new_password: string; confirm_password: string }) => {
        try {
            const response = await api.post(`/password/change`, data);
            return response;
        } catch (error: any) {
            // Retry with possible '/auth' prefix if route not found
            if (error?.response?.status === 404) {
                try {
                    const response = await api.post(`/auth/password/change`, data);
                    return response;
                } catch (err2: any) {
                    console.log(err2.response?.data);
                    const errorMessage =
                        err2.response?.data?.error ||
                        err2.response?.data?.message ||
                        "failed";
                    throw new Error(errorMessage);
                }
            }
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    forgotPassword = async (data: { email: string }) => {
        try {
            const response = await api.post(`/password/forgot`, data);
            return response;
        } catch (error: any) {
            if (error?.response?.status === 404) {
                try {
                    const response = await api.post(`/auth/password/forgot`, data);
                    return response;
                } catch (err2: any) {
                    console.log(err2.response?.data);
                    const errorMessage =
                        err2.response?.data?.error ||
                        err2.response?.data?.message ||
                        "failed";
                    throw new Error(errorMessage);
                }
            }
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    resetPassword = async (data: { token: string; new_password: string; confirm_password: string }) => {
        try {
            const response = await api.post(`/password/reset`, data);
            return response;
        } catch (error: any) {
            if (error?.response?.status === 404) {
                try {
                    const response = await api.post(`/auth/password/reset`, data);
                    return response;
                } catch (err2: any) {
                    console.log(err2.response?.data);
                    const errorMessage =
                        err2.response?.data?.error ||
                        err2.response?.data?.message ||
                        "failed";
                    throw new Error(errorMessage);
                }
            }
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };
}

const authRequests = new AuthRequests();
export default authRequests;
