import api from "../Api";

class InstructorRequests {
	// Survey Management endpoints for instructor (using admin endpoints with instructor auth)
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

	// Get instructor's courses for dropdown filter
	getInstructorCourses = async () => {
		try {
			const response = await api.get(`/courses`);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to fetch instructor courses";
			throw new Error(errorMessage);
		}
	};

	// Export survey data
	exportSurveyData = async (courseId?: number, rating?: number, format: string = 'csv') => {
		try {
			let url = `/admin/surveys/export?format=${format}`;
			if (courseId) url += `&course_id=${courseId}`;
			if (rating) url += `&rating=${rating}`;
			
			const response = await api.get(url, {
				responseType: 'blob'
			});
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to export survey data";
			throw new Error(errorMessage);
		}
	};

	// Get detailed survey information
	getSurveyDetails = async (surveyId: number) => {
		try {
			const response = await api.get(`/admin/surveys/${surveyId}`);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to fetch survey details";
			throw new Error(errorMessage);
		}
	};

	// Course management methods (existing functionality)
	createCourse = async (data: any) => {
		try {
			const response = await api.post(`/instructor/upload-course`, data);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to create course";
			throw new Error(errorMessage);
		}
	};

	getCourses = async (page: number = 1, perPage: number = 10) => {
		try {
			const response = await api.get(`/instructor/courses?page=${page}&per_page=${perPage}`);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to fetch courses";
			throw new Error(errorMessage);
		}
	};

	updateCourse = async (courseId: number, data: any) => {
		try {
			const response = await api.put(`/instructor/courses/${courseId}`, data);
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
			const response = await api.delete(`/instructor/courses/${courseId}`);
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

	// Module management
	getModules = async (courseId?: number) => {
		try {
			let url = `/instructor/modules`;
			if (courseId) url += `?course_id=${courseId}`;
			
			const response = await api.get(url);
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

	createModule = async (data: any) => {
		try {
			const response = await api.post(`/instructor/modules`, data);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to create module";
			throw new Error(errorMessage);
		}
	};

	updateModule = async (moduleId: number, data: any) => {
		try {
			const response = await api.put(`/instructor/modules/${moduleId}`, data);
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

	deleteModule = async (moduleId: number) => {
		try {
			const response = await api.delete(`/instructor/modules/${moduleId}`);
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

	// Student management
	getStudents = async (courseId?: number) => {
		try {
			let url = `/instructor/students`;
			if (courseId) url += `?course_id=${courseId}`;
			
			const response = await api.get(url);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to fetch students";
			throw new Error(errorMessage);
		}
	};

	// Analytics and dashboard data
	getDashboardStats = async () => {
		try {
			const response = await api.get(`/instructor/dashboard/stats`);
			return response;
		} catch (error: any) {
			console.log(error.response?.data);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				"Failed to fetch dashboard statistics";
			throw new Error(errorMessage);
		}
	};
}

const instructorRequests = new InstructorRequests();
export default instructorRequests;
