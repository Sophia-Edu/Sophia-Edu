import { HomeOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";

export const URL = {
	HOME: "/",
	LOGIN: "/login",
	REGISTER: "/register",
	CONTACT: "/contact-us",
	ABOUT: "/about-us",
	FORGOT_PASSWORD: "/forgot-password",
	SET_PASSWORD: "/set-password",
	PRIVACY: "/privacy/",
	TERMS: "/terms-of-use/",
	BLOG: "/blog",
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
			path: URL.ABOUT,
			name: "About",
			icon: UserOutlined,
		},
		{
			path: URL.PRIVACY,
			name: "Privacy",
			icon: UserOutlined,
		},
		{
			path: URL.TERMS,
			name: "Terms of Use",
			icon: UserOutlined,
		},
		{
			path: URL.FORGOT_PASSWORD,
			name: "Forgot Password",
			icon: UserOutlined,
		},
		{
			path: URL.SET_PASSWORD,
			name: "Set Password",
			icon: UserOutlined,
		},
		{
			path: URL.CONTACT,
			name: "Contact us",
			icon: UserOutlined,
		},
	],
};
export const applied_science_data = [
	"Agriculture",
	"Architecture and design",
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
	"Languages and literature",
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
	"Anthropology",
	"Archaeology",
	"Economics",
	"Geography",
	"Linguistics",
	"Political science",
	"Psychology",
	"Sociology",
	"Social work",
];
