import React from "react";
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	Outlet,
	useLocation,
} from "react-router-dom";
import { getStoredAuthToken, getUserType } from "../utils/storage";

import { URL } from "../utils/constants";
import ScrollToTop from "../components/scrollTotTop";
import allRoutes from "./all.routes";

const generateRandomString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const renderRoutes = (routes: any[] = []) => routes.map((route) => {
	let routeProps = {
		path: route.path,
		exact: route.exact,
		index: route.index,
		name: route.name,
	}

	return (route.requiresAuth) ? (
		<Route key={generateRandomString()} { ...routeProps } element={<PrivateRoute allowedRoles={[route.userType]} />}>
			{
				(route.children && route.children.length) ? renderRoutes(route.children) : <Navigate to={`${['instructor', 'admin'].includes(route.userType) ? `/${route.userType}/login` : '/login'}`} />
			}
		</Route>
	) : (
		<Route key={generateRandomString()} { ...routeProps } element={route.element} />
	)
})

const Router: React.FC = () => {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Routes>
				{
					renderRoutes(allRoutes)
				}
			</Routes>
		</BrowserRouter>
	);
};

interface PrivateRouteProps {
	allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
	const token = getStoredAuthToken();
	const userType = getUserType();
	const location = useLocation();

	if (!token) {
		// Store the current path as redirect URL before navigating to login
		const fromPath = location.pathname + location.search;
		localStorage.setItem('redirectUrl', fromPath);

		if (fromPath.startsWith("/admin")) {
			return <Navigate to={`${URL.ADMIN_LOGIN}?redirect=${encodeURIComponent(fromPath)}`} />;
		} else if (fromPath.startsWith("/instructor")) {
			return <Navigate to={`${URL.TUTORLOGIN}?redirect=${encodeURIComponent(fromPath)}`} />;
		} else {
			return <Navigate to={`/login?redirect=${encodeURIComponent(fromPath)}`} />;
		}
	}

	if (!allowedRoles.includes(userType || "")) {
		if (userType === "student") {
			return <Navigate to={URL.HOME} />;
		} else if (userType === "instructor") {
			return <Navigate to={URL.OVERVIEW} />;
		} else if (userType === "admin") {
			return <Navigate to={URL.ADMIN_OVERVIEW} />;
		}
	}

	return <Outlet />;
};

export default Router;
