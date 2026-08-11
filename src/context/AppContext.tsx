import { createContext, useContext, useState, type ReactNode } from "react";

type AppContextType = {
	redirectPage?: string;
	setRedirectPage: (route: string) => void;
};

//create the context using the type and init as undefined
const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
	children: ReactNode;
};

//app provider component that inits
export function AppProvider({ children }: AppProviderProps) {
	const [redirectPage, _setRedirectPage] = useState<string | undefined>(undefined);
	const setRedirectPage = (route: string) => {
		_setRedirectPage(route);
	};

	return <AppContext value={{ redirectPage, setRedirectPage }}>{children}</AppContext>;
}

//custom hook to prevent undefined checks
export function useApp() {
	const context = useContext(AppContext);

	if (context === undefined) {
		throw new Error("useApp must be used within a AppProvider");
	}

	return context;
}
