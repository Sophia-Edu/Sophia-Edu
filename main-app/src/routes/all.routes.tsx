import {
    LoginPage, RegisterPage,
    ForgotPasswordPage,
    ResetPasswordPage,
} from "../pages/STUDENT"
import { TutorLoginPage } from "../pages/TUTOR";
import { AdminLogin } from "../pages/ADMIN";
import { URL } from "../utils/constants";
import studentRoutes from "./students.routes";
import adminRoutes from "./admin.routes";
import instructorRoutes from "./instructor.routes";

const allRoutes = [
    {
        requiresAuth: true,
        exact: true,
        userType: "student",
        name: "Student",
        children: [...studentRoutes]
    },
    {
        path: URL.LOGIN,
        element: (<LoginPage/>),
        name: 'Login',
    },
    {
        path: URL.TUTORLOGIN,
        element: (<TutorLoginPage/>),
        name: 'Instructor Login',
    },
    {
        path: URL.ADMIN_LOGIN,
        element: (<AdminLogin/>),
        name: 'Admin Login',
    },
    {
        path: URL.REGISTER,
        element: (<RegisterPage/>),
        name: 'Register',
    },
    {
        path: URL.FORGOT_PASSWORD,
        element: (<ForgotPasswordPage/>),
        name: 'Forgot Password',
    },
    {
        path: URL.RESET_PASSWORD,
        element: (<ResetPasswordPage/>),
        name: 'Reset Password',
    },
    {
        path: "/admin",
        name: "Admin",
        requiresAuth: true,
        exact: true,
        userType: "admin",
        children: [...adminRoutes]
    },
    {
        path: "/instructor",
        name: "Instructor",
        requiresAuth: true,
        exact: true,
        userType: "instructor",
        children: [...instructorRoutes]
    }
]

export default allRoutes;
