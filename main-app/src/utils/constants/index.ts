import { HomeOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";

export const URL = {
	//Student URL
	HOME: "/",
	LOGIN: "/login",
	REGISTER: "/register",
	CONTACT: "/contact-us",
	ABOUT: "/about-us",
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",
	PRIVACY: "/privacy/terms-of-service",
	COURSELISTING: "/course/all",
	ABOUTCOURSE: "/course/",
	LEARNING: "/course/:id/learning",
	BLOG: "/blog",
	PROFILE: "/profile/me/settings",
	BIO: "/profile/me/bio",
	USER_PROFILE: "/profile/:id",
	WALLET: "/wallet",
	GENERATE_CERTIFICATE: "/generate-certificate",
	// New certificate routes
	CERTIFICATE_VIEW: "/certificates/:id", // private view (owner/admin)
	CERTIFICATE_PUBLIC: "/c/:slug", // public sharing/verification
	NOTIFICATION: "/notifications",
	UPLOAD: "/upload",
	MESSAGING: "/messaging",
	// Post detail (for shared links)
	POST_DETAIL: "/posts/",

	//Tutor URL
	OVERVIEW: "/instructor/overview",
	COURSES: "/instructor/courses",
	CREATE_COURSE: "/instructor/courses/create",
	STUDENTS_LIST: "/instructor/students",
	TUTOR_WALLET: "/instructor/wallet",
	SETTINGS: "/instructor/settings",
	TUTORLOGIN: "/instructor/login",

	//Admin URL
	ADMIN_OVERVIEW: "/admin/overview",
	ADMIN_COURSES: "/admin/courses",
	ADMIN_CREATE_COURSE: "/admin/courses/create",
	TUTOR_LIST: "/admin/instructors",
	ADMIN_WALLET: "/admin/wallet",
	ADMIN_SETTINGS: "/admin/settings",
	ADMIN_USERS: "/admin/user/:id",
	ADMIN_STUDENTS: "/admin/instructor/:slug/students",
	ADMIN_CREATE_INSTRUCTOR: "/admin/instructor",
	ADMIN_BLOGS: "/admin/blog",
	ADMIN_CREATE_BLOGS: "/admin/create-blog",
	ADMIN_CATEGORIES: "/admin/categories",
	ADMIN_CREATE_CATEGORY: "/admin/categories/create",
	ADMIN_SUBJECTS_INDUSTRIES: "/admin/subjects-industries",
	ADMIN_LOGIN: "/admin/login",
};

export const APPCONSTANTS = {
	APP_NAME: "Sophia",
	APP_PURPLE: "#800080",
	APP_DARK_PURPLE: "#581A57",
	APP_BLACK: "#121212",
	ROUTES: [
		{
			path: URL.HOME,
			name: "Home",
			icon: HomeOutlined,
		},
		{
			path: URL.LOGIN,
			name: "Login",
			icon: LoginOutlined,
		},
		{
			path: URL.REGISTER,
			name: "Register",
			icon: UserOutlined,
		},
		{
			path: URL.COURSELISTING,
			name: "Course_Listing",
			icon: UserOutlined,
		},
		{
			path: URL.ABOUTCOURSE,
			name: "Course_Details",
			icon: UserOutlined,
		},
		{
			path: URL.LEARNING,
			name: "Course_Learning",
			icon: UserOutlined,
		},
		{
			path: URL.PROFILE,
			name: "Profile",
			icon: UserOutlined,
		},
		{
			path: URL.BIO,
			name: "Friend Profile",
			icon: UserOutlined,
		},
		{
			path: URL.WALLET,
			name: "Wallet",
			icon: UserOutlined,
		},
		{
			path: URL.GENERATE_CERTIFICATE,
			name: "Certificate",
			icon: UserOutlined,
		},
		{
			path: URL.CERTIFICATE_VIEW,
			name: "My Certificate",
			icon: UserOutlined,
		},
		{
			path: URL.CERTIFICATE_PUBLIC,
			name: "Public Certificate",
			icon: UserOutlined,
		},
		{
			path: URL.NOTIFICATION,
			name: "Notifications",
			icon: UserOutlined,
		},
		{
			path: URL.UPLOAD,
			name: "Upload",
			icon: UserOutlined,
		},
		{
			path: URL.MESSAGING,
			name: "Upload",
			icon: UserOutlined,
		},
		{
			path: URL.FORGOT_PASSWORD,
			name: "Forgotn] Password",
			icon: UserOutlined,
		},

		{
			path: URL.OVERVIEW,
			name: "Dashboard Overview",
			icon: UserOutlined,
		},
		{
			path: URL.COURSES,
			name: "Instructor Courses",
			icon: UserOutlined,
		},
		{
			path: URL.CREATE_COURSE,
			name: "Instructor Create Courses",
			icon: UserOutlined,
		},
		{
			path: URL.STUDENTS_LIST,
			name: "Instructor Student List",
			icon: UserOutlined,
		},
		{
			path: URL.TUTOR_WALLET,
			name: "Instructor wallet",
			icon: UserOutlined,
		},
		{
			path: URL.SETTINGS,
			name: "Instructor settings",
			icon: UserOutlined,
		},
		{
			path: URL.ADMIN_OVERVIEW,
			name: "admin settings",
			icon: UserOutlined,
		},
		{
			path: URL.ADMIN_COURSES,
			name: "admin courses",
			icon: UserOutlined,
		},
		{
			path: URL.TUTOR_LIST,
			name: "admin instructors",
			icon: UserOutlined,
		},
		{
			path: URL.ADMIN_STUDENTS,
			name: "admin instructors",
			icon: UserOutlined,
		},
		{
			path: URL.ADMIN_CREATE_INSTRUCTOR,
			name: "admin instructors",
			icon: UserOutlined,
		},
		{
			path: URL.ADMIN_WALLET,
			name: "admin instructors",
			icon: UserOutlined,
		},
		{
			path: URL.ADMIN_BLOGS,
			name: "admin instructors",
			icon: UserOutlined,
		},
		{
			path: URL.ADMIN_CREATE_BLOGS,
			name: "admin instructors",
			icon: UserOutlined,
		},
		{
			path: URL.ADMIN_CATEGORIES,
			name: "admin categories",
			icon: UserOutlined,
		},
		{
			path: URL.ADMIN_CREATE_CATEGORY,
			name: "admin create category",
			icon: UserOutlined,
		},
		{
			path: URL.ADMIN_SETTINGS,
			name: "admin instructors",
			icon: UserOutlined,
		},
		{
			path: URL.ADMIN_USERS,
			name: "admin users",
			icon: UserOutlined,
		},
		{
			path: URL.TUTORLOGIN,
			name: "admin users",
			icon: UserOutlined,
		},
		{
			path: URL.ADMIN_LOGIN,
			name: "admin users",
			icon: UserOutlined,
		},
	],
};

export const applied_science_data = [
	"Agriculture",
	"Architecture  and Design",
	"Business",
	"Education",
	"Engineering and technology",
	"Environmental studies and  forestry",
	"Family and consumer science",
	"Human physical performance and recreation",
	"Journalism, media studies and communication",
	"Law",
	"Library and museum studies",
	"Medicine and health",
	"Military sciences",
	"Public administration",
	"Public policy",
	"Social work",
	"Transportation",
];
export const formal_science_data = ["Computer Science", "Mathematics"];
export const humanities_data = [
	"Performing arts",
	"Visual Arts",
	"History",
	"Languagesw and literature",
	"Law",
	"Philosophy",
	"Religious Studies",
	"Divinity",
	"Theology",
];
export const natural_science_data = [
	"Biology",
	"Chemistry",
	"Earth science",
	"Astronomy",
	"Physics",
];
export const social_science_data = [
	"Antropoly",
	"Archaeology",
	"Economics",
	"Geography",
	"Linguistics",
	"Political science",
	"Psychology",
	"Sociology",
	"Social work",
];
