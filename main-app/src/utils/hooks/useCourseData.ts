import completeCoursesData from "../constants/complete_courses_data.json";

interface CourseType {
    [courseName: string]: string[];
}

interface CourseCategory {
    [courseType: string]: CourseType;
}

interface CompleteCoursesData {
    [category: string]: CourseCategory;
}

const coursesData: CompleteCoursesData = completeCoursesData;

export const useCourseData = () => {
    const getCourseCategories = () => {
        return Object.keys(coursesData || {});
    };

	const getCourseTypes = (category: string) => {
        return Object.keys(coursesData[category] || {});
    };

    const getCourseNames = (category: string, type: string) => {
        return Object.keys(coursesData[category]?.[type] || {});
    };

    const getCourseTitles = (category: string, type: string, name: string) => {
        return coursesData[category]?.[type]?.[name] || [];
    };

	return { getCourseTypes, getCourseNames, getCourseTitles, getCourseCategories };
};
