import api from "../Api";

class TutorRequests {
    // Logged-in instructor profile
    getMyProfile = async () => {
        try {
            const response = await api.get(`/instructor/profile/me`);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to fetch my instructor profile";
            throw new Error(errorMessage);
        }
    };
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

    /**
     * Enhanced course update method for instructor dashboard
     * Supports flexible payload with module management options
     * 
     * @param courseId - ID of the course to update (can be in data.courseId or as separate parameter)
     * @param data - Course update payload
     * 
     * Payload format:
     * {
     *   course_title?: string,
     *   course_name?: string,
     *   body?: string,
     *   brief?: string,
     *   course_type?: string,
     *   price?: number,
     *   status?: string,
     *   course_category?: string,
     *   image_url?: string,
     *   video_url?: string,
     *   module_ids?: number[],        // Complete replacement
     *   add_module_ids?: number[],    // Add to existing modules
     *   remove_module_ids?: number[]  // Remove from specific modules
     * }
     */
    updateCourse = async (courseId: number | any, data?: any) => {
        try {
            // Handle both old format (data.courseId) and new format (separate courseId parameter)
            let actualCourseId: number;
            let actualData: any;
            
            if (typeof courseId === 'object' && courseId.courseId) {
                // Old format: updateCourse(data) where data contains courseId
                actualCourseId = courseId.courseId;
                actualData = courseId;
            } else {
                // New format: updateCourse(courseId, data)
                actualCourseId = courseId;
                actualData = data || {};
            }

            const response = await api.put(`/courses/${actualCourseId}`, actualData);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to update course";
            throw new Error(errorMessage);
        }
    };

    deleteCourse = async (courseId: number) => {
        try {
            const response = await api.delete(`/courses/${courseId}`);
            return response;
        } catch (error: any) {
            // Extract the message or create a custom error message
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to delete course";
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

    // Fetch modules for a given course
    getModules = async (courseId: number) => {
        try {
            // Assumption: backend exposes course modules at this path
            const response = await api.get(`/courses/${courseId}/modules`);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to fetch modules";
            throw new Error(errorMessage);
        }
    };

    // List all modules (no course filter): GET /modules
    listModules = async () => {
        try {
            const response: any = await api.get(`/modules`);
            // Interceptor usually returns response.data, but normalize defensively
            const root = response?.data ?? response;
            if (Array.isArray(root)) return root;
            if (Array.isArray(root?.items)) return root.items;
            if (Array.isArray(root?.modules)) return root.modules;
            // support nested { data: [...] } or { data: { items|modules: [...] } }
            const d1 = root?.data;
            if (Array.isArray(d1)) return d1;
            if (Array.isArray(d1?.items)) return d1.items;
            if (Array.isArray(d1?.modules)) return d1.modules;
            const d2 = d1?.data;
            if (Array.isArray(d2)) return d2;
            if (Array.isArray(d2?.items)) return d2.items;
            if (Array.isArray(d2?.modules)) return d2.modules;
            // If nothing found, try alternate common endpoints
            console.debug('listModules(): /modules returned no array; trying /instructor/modules');
            try {
                const alt: any = await api.get(`/instructor/modules`);
                const altRoot = alt?.data ?? alt;
                if (Array.isArray(altRoot)) return altRoot;
                if (Array.isArray(altRoot?.items)) return altRoot.items;
                if (Array.isArray(altRoot?.modules)) return altRoot.modules;
                const a1 = altRoot?.data;
                if (Array.isArray(a1)) return a1;
                if (Array.isArray(a1?.items)) return a1.items;
                if (Array.isArray(a1?.modules)) return a1.modules;
            } catch (e) {
                // ignore and fall through
            }
            return [];
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to list modules";
            throw new Error(errorMessage);
        }
    };

    // Update a module by id
    updateModule = async (moduleId: number, data: any) => {
        try {
            const response = await api.put(`/modules/${moduleId}`, data);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to update module";
            throw new Error(errorMessage);
        }
    };

    // Delete a module by id
    deleteModule = async (moduleId: number) => {
        try {
            const response = await api.delete(`/modules/${moduleId}`);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to delete module";
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

    // Public: list instructor profiles
    getInstructorProfiles = async (params?: any) => {
        try {
            const response = await api.get(`/instructor/profile`, { params });
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to fetch instructor profiles";
            throw new Error(errorMessage);
        }
    };

    // Public: get instructor by id
    getInstructorById = async (id: string | number) => {
        try {
            const response = await api.get(`/instructor/profile/${id}`);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to fetch instructor profile";
            throw new Error(errorMessage);
        }
    };

    // Auth required: update current instructor profile
    updateInstructorProfile = async (data: any) => {
        try {
            const response = await api.put(`/instructor/profile`, data);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to update instructor profile";
            throw new Error(errorMessage);
        }
    };
}

const tutorRequests = new TutorRequests();
export default tutorRequests;
