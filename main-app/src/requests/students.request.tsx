import api from "../Api";

class StudentRequest {
    enrollForCourse = async (courseId: number) => {
        try {
            const response = await api.post(`course/${courseId}`);
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
    followCourse = async (course_id: number) => {
        try {
            const response = await api.post(`courses/${course_id}/follow`,);
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
    }
    unFollowCourse = async (course_id: number) => {
        try {
            const response = await api.post(`courses/${course_id}/unfollow`,);
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
    }
    getCourseCategrories = async (course_id: number) => {
        try {
            const response = await api.get(`courses/${course_id}/course-categories`,);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage = (error.response?.data?.error || error.response?.data?.message || "failed");
            throw new Error(errorMessage);
        }
    }
    getEnrolledCourse = async (userId: number) => {
        try {
            const response = await api.get(`users/${userId}/enrolled-courses`);
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
    }
    getFollowedCourse = async (userId: number) => {
        try {
            const response = await api.get(`users/${userId}/followed-courses`);
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
    }
    getNotifications = async () => {
        try {
            const response = await api.get(`/notifications`);
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
    }
    getAllCourses = async (page: number = 1) => {
        try {
            const response = await api.get(`/courses?page=${page}`);
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
    }
    
    getCourseById = async (courseId: string | number) => {
        try {
            const response = await api.get(`/courses/${courseId}`);
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
    }
}

const studentRequest = new StudentRequest();
export default studentRequest;
