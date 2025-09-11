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
    getAllCourses = async (page: number = 1, category?: string, priceMin?: number, priceMax?: number, perPage: number = 10) => {
        try {
            let url: string;
            
            // Use category-based endpoints if category is provided
            if (category) {
                // Clean up category name to match backend expectations
                let cleanCategory = category.trim();
                
                // Handle specific category mappings to match backend exactly
                // No modification needed - use category as provided
                
                // Use the new category-based endpoint format
                url = `/courses/category/${encodeURIComponent(cleanCategory)}`;
                
                // Add pagination parameters
                const params = new URLSearchParams();
                params.append('page', page.toString());
                params.append('per_page', perPage.toString());
                
                // Add price filters if provided
                if (priceMin !== undefined) {
                    params.append('price_min', priceMin.toString());
                }
                if (priceMax !== undefined) {
                    params.append('price_max', priceMax.toString());
                }
                
                // Append query parameters if any exist
                if (params.toString()) {
                    url += `?${params.toString()}`;
                }
            } else {
                // Fallback to general courses endpoint for "all" courses
                url = `/courses?page=${page}&per_page=${perPage}`;
                
                // Add price filters if provided
                if (priceMin !== undefined) {
                    url += `&price_min=${priceMin}`;
                }
                if (priceMax !== undefined) {
                    url += `&price_max=${priceMax}`;
                }
            }
            
            console.log('Fetching courses from URL:', url);
            const response = await api.get(url);
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

    // Advanced course search using /courses/filter endpoint
    searchCourses = async (
        searchTerm: string, 
        page: number = 1, 
        perPage: number = 10,
        courseType?: string,
        category?: string
    ) => {
        try {
            const params = new URLSearchParams();
            
            // Add search parameters
            if (searchTerm.trim()) {
                params.append('course_name', searchTerm.trim());
                params.append('title', searchTerm.trim());
            }
            
            // Add pagination
            params.append('page', page.toString());
            params.append('per_page', perPage.toString());
            
            // Add optional filters
            if (courseType) {
                params.append('course_type', courseType);
            }
            if (category) {
                params.append('category', category);
            }
            
            const url = `/courses/filter?${params.toString()}`;
            console.log('Searching courses with URL:', url);
            
            const response = await api.get(url);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Search failed";
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

    // Survey endpoints
    submitCourseSurvey = async (courseId: string | number, surveyData: { satisfaction_rating: number; additional_comments?: string }) => {
        try {
            const response = await api.post(`/courses/${courseId}/survey`, surveyData);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            // Preserve the original error object with response data
            if (error.response) {
                error.message = error.response?.data?.error || 
                               error.response?.data?.message || 
                               error.message || 
                               "failed";
            }
            throw error;
        }
    }

    getMySurvey = async (courseId: string | number) => {
        try {
            const response = await api.get(`/courses/${courseId}/survey/my`);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    // Peer Review endpoints
    uploadDocumentForReview = async (courseId: string | number, file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('course_id', courseId.toString());
            
            const response = await api.post('/peer-review/upload', formData);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            if (error.response) {
                error.message = error.response?.data?.error || 
                               error.response?.data?.message || 
                               error.message || 
                               "failed";
            }
            throw error;
        }
    }

    resubmitDocumentForReview = async (courseId: string | number, file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('course_id', courseId.toString());
            
            const response = await api.post('/peer-review/resubmit', formData);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            if (error.response) {
                error.message = error.response?.data?.error || 
                               error.response?.data?.message || 
                               error.message || 
                               "failed";
            }
            throw error;
        }
    }

    getAvailableReviews = async (courseId: string | number) => {
        try {
            const response = await api.get(`/peer-review/available/${courseId}`);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    downloadReviewDocument = async (reviewId: number) => {
        try {
            const response = await api.get(`/peer-review/download/${reviewId}`, {
                responseType: 'blob'
            });
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    submitReviewFeedback = async (reviewId: number, remarks: string) => {
        try {
            const response = await api.post(`/peer-review/submit/${reviewId}`, { remarks });
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    uploadFeedbackFile = async (reviewId: number, file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await api.post(`/peer-review/feedback/upload/${reviewId}`, formData);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    downloadFeedbackFile = async (reviewId: number) => {
        try {
            const response = await api.get(`/peer-review/feedback/download/${reviewId}`, {
                responseType: 'blob'
            });
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    getMySubmissions = async () => {
        try {
            const response = await api.get('/peer-review/my-submissions');
            return response;
        } catch (error: any) {
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
