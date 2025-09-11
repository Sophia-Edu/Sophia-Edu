import {
	CoursePage,
	CreateCoursePage,
	OverviewPage,
	SettingsPage,
	StudentsPage,
	TutorWalletPage,
	SurveyManagementPage,
} from "../pages/TUTOR";
import { URL } from "../utils/constants";

const instructorRoutes = [
    {
        path: URL.OVERVIEW,
        element: <OverviewPage />,
        name: 'Instructor Overview',
    },
    {
        path: URL.COURSES,
        element: <CoursePage />,
        name: 'Instructor Courses',
    },
    {
        path: URL.CREATE_COURSE,
        element: <CreateCoursePage />,
        name: 'Create Course',
    },
    {
        path: URL.STUDENTS_LIST,
        element: <StudentsPage />,
        name: 'Instructor Students',
    },
    {
        path: URL.TUTOR_WALLET,
        element: <TutorWalletPage />,
        name: 'Tutor Wallet',
    },
    {
        path: URL.SETTINGS,
        element: <SettingsPage />,
        name: 'Instructor Settings',
    },
    {
        path: URL.INSTRUCTOR_SURVEYS,
        element: <SurveyManagementPage />,
        name: 'Survey Management',
    },
]

export default instructorRoutes;