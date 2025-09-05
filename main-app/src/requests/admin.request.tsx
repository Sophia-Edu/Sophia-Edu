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
	}
}

const adminRequests = new AdminRequests();
export default adminRequests;
