import Cookies from "js-cookie";

const AUTH_TOKEN_KEY = "token";
const TOKEN_EXPIRATION_KEY = "token_expiration";
const ONE_HOUR_MS = 60 * 60 * 1000;
const USER_TYPE = "usertype";

export const getStoredAuthToken = () => {
	const token = Cookies.get(AUTH_TOKEN_KEY);
	const expiration = Cookies.get(TOKEN_EXPIRATION_KEY);

	if (token && expiration) {
		const now = new Date().getTime();
		if (now < Number(expiration)) {
			return token;
		} else {
			removeStoredAuthToken();
		}
	}
	return null;
};

export const setStoredAuthToken = (token: string, type: string) => {
	const now = new Date().getTime();
	const expiration = now + ONE_HOUR_MS;
	Cookies.set(AUTH_TOKEN_KEY, token, { expires: new Date(expiration) });
	Cookies.set(USER_TYPE, type);
	Cookies.set(TOKEN_EXPIRATION_KEY, expiration.toString(), {
		expires: new Date(expiration),
	});
};

export const removeStoredAuthToken = () => {
	Cookies.remove(AUTH_TOKEN_KEY);
	Cookies.remove(TOKEN_EXPIRATION_KEY);
};

export const storeAdminUser = (user: string) => Cookies.set("SadminUser", user);

export const getStoredAdminUser = () => Cookies.get("SadminUser");

export const storeClientUser = (user: string) =>
	Cookies.set("SClientUser", user);

export const getStoredClientUser = () => Cookies.get("SClientUser");
export const getUserType = () => Cookies.get("usertype");
