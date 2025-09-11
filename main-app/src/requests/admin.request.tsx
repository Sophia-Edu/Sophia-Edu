import api from "../Api";

class AdminRequests {
	createAdmin = async (data: any) => {
		try {
			const response = await api.post(`/create-admin`, data);
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

	// Subjects and Industries Management
	createSubject = async (data: any) => {
		try {
			const response = await api.post(`/subjects`, data);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"failed";
			throw new Error(errorMessage);
		}
	};

	bulkCreateSubjects = async (payload: any) => {
		try {
			// Accept a File/Blob directly or an object with a `file` property
			const file: File | Blob | undefined =
				payload instanceof Blob
					? (payload as File | Blob)
					: payload?.file;
			if (!file) {
				throw new Error("Bulk upload requires a file (.csv or .xlsx) under 'file'.");
			}
			// Bulk uploads remain server-side as they typically require server processing
			const form = new FormData();
			form.append("file", file as any);
			const response = await api.post(`/subjects/upload`, form, {
				headers: { "Content-Type": "multipart/form-data" },
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
	};

	uploadSubjectsFile = async (file: File | Blob) => {
		try {
			const form = new FormData();
			form.append("file", file as any);
			const response = await api.post(`/subjects/upload`, form, {
				headers: { "Content-Type": "multipart/form-data" },
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
	};

	createIndustry = async (data: any) => {
		try {
			const response = await api.post(`/industries`, data);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"failed";
			throw new Error(errorMessage);
		}
	};

	bulkCreateIndustries = async (payload: any) => {
		try {
			// Accept a File/Blob directly or an object with a `file` property
			const file: File | Blob | undefined =
				payload instanceof Blob
					? (payload as File | Blob)
					: payload?.file;
			if (!file) {
				throw new Error("Bulk upload requires a file (.csv or .xlsx) under 'file'.");
			}
			const form = new FormData();
			form.append("file", file as any);
			const response = await api.post(`/industries/upload`, form, {
				headers: { "Content-Type": "multipart/form-data" },
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
	};

	uploadIndustriesFile = async (file: File | Blob) => {
		try {
			const form = new FormData();
			form.append("file", file as any);
			const response = await api.post(`/industries/upload`, form, {
				headers: { "Content-Type": "multipart/form-data" },
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
	};
	fetchAllAdmins = async () => {
		try {
			const response = await api.get(`/admin/admins`);
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
	deleteAdmin = async (id: number) => {
		try {
			const response = await api.delete(`/admin/admins/${id}`);
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

	editAdmin = async (id: number, data: any) => {
		try {
			const response = await api.put(`/admin/update/${id}`, data);
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
	};	createInstructor = async (data: any) => {
		try {
			const response = await api.post(`/admin/instructors`, data);
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
	
	createCategory = async (data: { name: string }) => {
		try {
			const response = await api.post(`/categories`, data);
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

	getCategories = async () => {
		try {
			const response = await api.get(`/categories`);
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

	createCourse = async (data: any) => {
		try {
			const response = await api.post(`/courses`, data);
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

	createCourseWithModules = async (data: any) => {
		try {
			const response = await api.post(`/courses/with-modules`, data);
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

	createBlog = async (data: any) => {
		try {
			const response = await api.post(`/blogs`, data);
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
	getBlogs = async () => {
		try {
			const response = await api.get(`/blogs`);
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

	getBlog = async (id: number) => {
		try {
			const response = await api.post(`/blogs/${id}`);
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

	editBlog = async (id: number, data: any) => {
		try {
			const response = await api.put(`/blogs/${id}`, data);
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
	deleteBlog = async (id: number) => {
		try {
			const response = await api.delete(`/blogs/${id}`);
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
	getInstructors = async () => {
		try {
			const response = await api.get(`/admin/instructors`);
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
	createRole = async (role: string) => {
		try {
			const response = await api.post(`/admin/roles`, { name: role });
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
	deleteRole = async (id: number) => {
		try {
			const response = await api.delete(`/admin/roles/${id}`);
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
	assignRole = async (payload: any) => {
		try {
			const response = await api.post(`/admin/assign-role`, payload);
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
	removeAssignedRole = async (payload: any) => {
		try {
			const response = await api.post(`/admin/remove-role`, payload);
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
	adminFetchUserRole = async (userId: number) => {
		try {
			const response = await api.get(`/admin/user-roles/${userId}`);
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
	adminFetchUserWithRoles = async () => {
		try {
			const response = await api.get(`/admin/user-with-roles`);
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
	fetchAllCourse = async () => {
		try {
			const response = await api.get(`/courses`);
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
	 * Enhanced course update method for admin dashboard
	 * Supports flexible payload with module management options
	 * 
	 * @param courseId - ID of the course to update
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
	updateCourse = async (courseId: number, data: any) => {
		try {
			const response = await api.put(`/courses/${courseId}`, data);
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

	/**
	 * Delete course method for admin dashboard
	 * @param courseId - ID of the course to delete
	 */
	deleteCourse = async (courseId: number) => {
		try {
			const response = await api.delete(`/courses/${courseId}`);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to delete course";
			throw new Error(errorMessage);
		}
	};

	// Course Metadata Management
	getCourseMetadata = async () => {
		try {
			const response = await api.get(`/courses/metadata`);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to fetch course metadata";
			throw new Error(errorMessage);
		}
	};

	getCourseMetadataSuggestions = async (type: string, query: string) => {
		try {
			const response = await api.get(`/courses/metadata/suggestions?type=${type}&query=${encodeURIComponent(query)}`);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to fetch course metadata suggestions";
			throw new Error(errorMessage);
		}
	};

	bulkUploadCourseMetadata = async (file: File | Blob) => {
		try {
			const form = new FormData();
			form.append("file", file as any);
			const response = await api.post(`/admin/courses/bulk-upload`, form, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to upload course metadata";
			throw new Error(errorMessage);
		}
	};

	// Survey Management endpoints for admin
	getCourseSurveys = async (courseId: number, page: number = 1, perPage: number = 10) => {
		try {
			const response = await api.get(`/admin/courses/${courseId}/surveys?page=${page}&per_page=${perPage}`);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to fetch course surveys";
			throw new Error(errorMessage);
		}
	};

	getAllSurveys = async (page: number = 1, perPage: number = 20, courseId?: number, rating?: number) => {
		try {
			let url = `/admin/surveys?page=${page}&per_page=${perPage}`;
			if (courseId) url += `&course_id=${courseId}`;
			if (rating) url += `&rating=${rating}`;
			
			const response = await api.get(url);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to fetch surveys";
			throw new Error(errorMessage);
		}
	};

	getSurveyStats = async (courseId?: number) => {
		try {
			let url = `/admin/surveys/stats`;
			if (courseId) url += `?course_id=${courseId}`;
			
			const response = await api.get(url);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to fetch survey statistics";
			throw new Error(errorMessage);
		}
	};
}

const adminRequests = new AdminRequests();
export default adminRequests;
