import ErrorBoundary from "./components/routing/ErrorBoundary";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ScheduleProvider } from "./contexts/SchedulesContext";
import { CalendarPage } from "./pages/CalendarPage";
import { FriendsPage } from "./pages/FriendsPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
	return (
		<ErrorBoundary>
			<AuthProvider>
				<ScheduleProvider>
					<BrowserRouter>
						<Routes>
							{/* Public Routes */}
							<Route path="/login" element={<LoginPage />} />
							<Route path="/register" element={<RegisterPage />} />

							{/* Protected Routes Wrapper */}
							<Route element={<ProtectedRoute />}>
								<Route path="/" element={<CalendarPage />} />
								<Route path="/calendar" element={<CalendarPage />} />
								<Route path="/friends" element={<FriendsPage />} />
								<Route path="/profile" element={<ProfilePage />} />
							</Route>
						</Routes>
					</BrowserRouter>
				</ScheduleProvider>
			</AuthProvider>
		</ErrorBoundary>
	);
}
