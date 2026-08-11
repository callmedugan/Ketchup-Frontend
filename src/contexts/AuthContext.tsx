import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

/* ========================================================================= */
//                        context
/* ========================================================================= */

export interface User {
	id: string;
	email: string;
	name: string;
	token?: string;
}

type AuthContextType = {
	token: string | null;
	login: (newToken: string) => void;
	logout: () => void;
	isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

/* ========================================================================= */
//                        provider
/* ========================================================================= */

type AuthProviderProps = {
	children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
	// use the function version of use state to immediately set
	const [token, setToken] = useState(() => localStorage.getItem("token"));

	// any time token is modified update local storage
	useEffect(() => {
		if (token) {
			localStorage.setItem("token", token);
		} else {
			localStorage.removeItem("token");
		}
	}, [token]);

	const login = (newToken: string) => {
		setToken(newToken);
	};

	const logout = () => {
		setToken(null);
	};

	return (
		<AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
			{children}
		</AuthContext.Provider>
	);
};

/* ========================================================================= */
//                        hook
/* ========================================================================= */

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
