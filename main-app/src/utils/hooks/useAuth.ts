import { useState, useEffect } from "react";

interface User {
	id: number;
	username: string;
	role: "student" | "admin" | "tutor";
}

interface AuthState {
	authenticated: boolean;
	user: User | null;
}

const useAuth = (): [
	AuthState,
	(user: User) => void,
	() => void,
	() => boolean
] => {
	const [authState, setAuthState] = useState<AuthState>({
		authenticated: false,
		user: null,
	});

	useEffect(() => {
		// Simulate fetching user data from localStorage on component mount
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setAuthState({ authenticated: true, user: JSON.parse(storedUser) });
		}
	}, []);

	const login = (user: User) => {
		// Simulate storing user data in localStorage
		localStorage.setItem("user", JSON.stringify(user));
		setAuthState({ authenticated: true, user });
	};

	const logout = () => {
		// Simulate clearing user data from localStorage
		localStorage.removeItem("user");
		setAuthState({ authenticated: false, user: null });
	};

	const isAdmin = () => {
		return authState.user?.role === "admin";
	};

	return [authState, login, logout, isAdmin];
};

export default useAuth;
