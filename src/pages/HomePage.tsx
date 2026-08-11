import Button from "../components/Button";
import Logo from "../components/Logo";
import { useAuth } from "../contexts/AuthContext";

export function HomePage() {
	const { logout } = useAuth();

	return (
		<main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				<Logo />

				{/* <h1 className="block text-center text-4xl font-medium text-gray-700 mb-1">
					Welcome, {user?.name}!
				</h1> */}
				<p className="block text-center text-sm font-medium text-gray-700 mb-1">Home Page</p>
				<Button onClick={logout}>Log Out</Button>
			</div>
		</main>
	);
}
