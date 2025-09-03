import api from "../Api";

class TutorRequests {
    getCategories = async () => {
        try {
            const response = await api.get(`/categories`);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to fetch categories";
            throw new Error(errorMessage);
        }
    };
    
    getCourseUploadOptions = async () => {
        try {
            const response = await api.get(`/instructor/course-upload-options`);
            return response.data;
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

    createCourse = async (data: any) => {
        try {
            const response = await api.post(`/instructor/upload-course`, data);
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

    updateCourse = async (data: any) => {
        try {
            const response = await api.put(`/course${data?.courseId}`, data);
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

    deleteCourse = async (courseId: number) => {
        try {
            const response = await api.delete(`/course/${courseId}`);
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
    uploadCourseVideo = async (data: any) => {
        try {
            const response = await api.post(
                `/upload_course_video/${data?.courseId}`,
                data
            );
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

    createCourseModule = async (data: any) => {
        try {
            const response = await api.post(`/modules`, data);
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

    // New method specifically for creating multiple modules at once
    createMultipleCourseModules = async (data: any) => {
        try {
            const response = await api.post(`/modules`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to create modules";
            throw new Error(errorMessage);
        }
    };

    fetchMyCourses = async () => {
        try {
            const response = await api.get(`/instructor/courses`);
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
}

const tutorRequests = new TutorRequests();
export default tutorRequests;
