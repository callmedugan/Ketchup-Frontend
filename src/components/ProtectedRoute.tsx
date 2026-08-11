import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute() {
	//const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();
	//testing
	const { isAuthenticated } = useAuth();

	// Prevent flash of login screen while checking auth tokens
	// if (isLoading) {
	// 	return <LoadingIndicator variant="Loading" />;
	// }

	// Redirect to login, saving the attempted URL in state for post-login redirection
	return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}
