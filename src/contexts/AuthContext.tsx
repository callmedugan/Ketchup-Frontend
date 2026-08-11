import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { isTokenValid } from "../utils/authUtils";

export type User = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
};

/* ========================================================================= */
//                        context
/* ========================================================================= */

type AuthContextType = {
	user: User | null;
	token: string | null;
	login: (newToken: string, user: User) => void;
	logout: () => void;
	manualLogout: () => Promise<void>;
	isAuthenticated: boolean;
	authFetch: (url: string, options?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | null>(null);

/* ========================================================================= */
//                        provider
/* ========================================================================= */

type AuthProviderProps = {
	children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
	//declare first
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);

	// use the function version of use state to immediately set and check if the token is valid on start or refresh
	const [token, setToken] = useState<string | null>(() => {
		const savedToken = localStorage.getItem("token");
		setIsAuthenticated(isTokenValid(savedToken));
		return savedToken;
	});

	// any time token is modified update local storage and set isAuthenticated
	useEffect(() => {
		if (token) localStorage.setItem("token", token);
		else localStorage.removeItem("token");
	}, [token]);

	function login(newToken: string, newUser: User) {
		setToken(newToken);
		setIsAuthenticated(isTokenValid(newToken));
		setUser(isTokenValid(newToken) ? newUser : null);
	}

	function logout() {
		setToken(null);
		setIsAuthenticated(false);
		setUser(null);
	}

	async function manualLogout() {
		// //try to hit the logout endpoint
		// const response = await fetch("http://localhost:8080/auth/logout", {
		// 	method: "POST",
		// 	headers: {
		// 		Authorization: `Bearer ${token}`,
		// 		"Content-Type": "application/json",
		// 	},
		// });

		// //error
		// if (!response.ok) {
		// 	throw new Error("User was not logged in or failed to logout");
		// }

		//success
		logout();
	}

	// fetch wrapper for auth calls
	async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
		// Create standard headers object
		const headers = new Headers(options.headers);

		if (!headers.has("Content-Type")) {
			headers.set("Content-Type", "application/json");
		}

		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}

		const response = await fetch(url, { ...options, headers });

		// token rejected by backend
		if (response.status === 401) {
			logout();
			throw new Error("Session expired. Please log in again.");
		}

		return response;
	}

	return (
		<AuthContext.Provider
			value={{ token, login, logout, isAuthenticated, authFetch, manualLogout, user }}
		>
			{children}
		</AuthContext.Provider>
	);
};

/* ========================================================================= */
//                        hook
/* ========================================================================= */

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
