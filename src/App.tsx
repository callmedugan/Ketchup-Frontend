import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorPage } from "./pages/Error";
import { FriendsPage } from "./pages/FriendsPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					{/* Public Routes */}
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/*" element={<ErrorPage />} />

					{/* Protected Routes Wrapper */}
					<Route element={<ProtectedRoute />}>
						<Route path="/home" element={<HomePage />} />
						<Route path="/friends" element={<FriendsPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}
