import { URL } from "../utils/constants";
import {
    AdminBlogPage,
 AdminCategoriesPage,
 AdminCoursePage,
 AdminCreateBlogPage,
 AdminCreateCategoryPage,
 AdminCreateCoursePage,
 AdminCreateInstructorPage,
 AdminEditUserPage,
 AdminInstructorsPage,
 AdminOverviewPage,
 AdminSettingsPage,
 AdminStudentsPage,
 AdminTutorWalletPage,
  AdminSubjectsIndustriesUploadPage,
 AdminCourseMetadataBulkUploadPage,
 AdminSurveyManagementPage,
} from "../pages/ADMIN";

const adminRoutes = [
    {
        path: URL.ADMIN_OVERVIEW,
        element: <AdminOverviewPage />,
        name: 'Admin Overview',
    },
    {
        path: URL.ADMIN_COURSES,
        element: <AdminCoursePage />,
        name: 'Admin Courses',
    },
    {
        path: URL.TUTOR_LIST,
        element: <AdminInstructorsPage />,
        name: 'Admin Instructors',
    },
    {
        path: URL.ADMIN_WALLET,
        element: <AdminTutorWalletPage />,
        name: 'Admin Wallet',
    },
    {
        path: URL.ADMIN_SETTINGS,
        element: <AdminSettingsPage />,
        name: 'Admin Settings',
    },
    {
        path: URL.ADMIN_USERS,
        element: <AdminEditUserPage />,
        name: 'Admin Users',
    },
    {
        path: URL.ADMIN_STUDENTS,
        element: <AdminStudentsPage />,
        name: 'Admin Students',
    },
    {
        path: URL.ADMIN_CREATE_INSTRUCTOR,
        element: <AdminCreateInstructorPage />,
        name: 'Admin Create Instructor',
    },
    {
        path: URL.ADMIN_BLOGS,
        element: <AdminBlogPage />,
        name: 'Admin Blogs',
    },    {
        path: URL.ADMIN_CREATE_BLOGS,
        element: <AdminCreateBlogPage />,
        name: 'Admin Create Blogs',
    },
    {
        path: URL.ADMIN_CATEGORIES,
        element: <AdminCategoriesPage />,
        name: 'Admin Categories',
    },
    {
        path: URL.ADMIN_CREATE_CATEGORY,
        element: <AdminCreateCategoryPage />,
        name: 'Admin Create Category',
    },
    {
        path: URL.ADMIN_CREATE_COURSE,
        element: <AdminCreateCoursePage />,
        name: 'Admin Create Course',
    },
    {
        path: URL.ADMIN_SUBJECTS_INDUSTRIES,
        element: <AdminSubjectsIndustriesUploadPage />,
        name: 'Admin Subjects & Industries Upload',
    },
    {
        path: URL.ADMIN_COURSE_METADATA_BULK_UPLOAD,
        element: <AdminCourseMetadataBulkUploadPage />,
        name: 'Admin Course Metadata Bulk Upload',
    },
    {
        path: URL.ADMIN_SURVEYS,
        element: <AdminSurveyManagementPage />,
        name: 'Admin Survey Management',
    },
]

export default adminRoutes;