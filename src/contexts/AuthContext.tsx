import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { isTokenValid } from "../utils/authUtils";

/* ========================================================================= */
//                        context
/* ========================================================================= */

type AuthContextType = {
	token: string | null;
	login: (newToken: string) => void;
	logout: () => void;
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
	// use the function version of use state to immediately set and check if the token is valid on start or refresh
	const [token, setToken] = useState<string | null>(() => {
		const savedToken = localStorage.getItem("token");

		return isTokenValid(savedToken) ? savedToken : null;
	});

	// any time token is modified update local storage
	useEffect(() => {
		if (token) {
			localStorage.setItem("token", token);
		} else {
			localStorage.removeItem("token");
		}
	}, [token]);

	function login(newToken: string) {
		setToken(newToken);
	}

	function logout() {
		setToken(null);
	}

	// fetch wrapper for auth calls
	async function authFetch(
		url: string,
		options: RequestInit = {},
		isRetry = false,
	): Promise<Response> {
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
		if (response.status === 401 && !isRetry) {
			//re scope
			const jwt = token;
			//try to hit the refresh endpoint
			try {
				const refresh = await authFetch(
					"http://localhost:8080/auth/refresh",
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					},
					false, //isRetry
				);
				//response
				const data = await refresh.json();

				//success
				const token = data?.token;
				if (token != undefined) {
					login(token);
					console.log("refreshed token");
				} else {
					logout();
					throw new Error("Session expired. Please log in again.");
				}
			} catch {
				throw new Error("Could not connect to the server.");
			}
		}

		return response;
	}

	return (
		<AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token, authFetch }}>
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
