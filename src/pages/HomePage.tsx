import { useEffect, useState } from "react";
import Button from "../components/Button";
import Logo from "../components/Logo";
import { useAuth } from "../contexts/AuthContext";
import { LoadingIndicator } from "../components/LoadingIndicator";

export function HomePage() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { manualLogout, user, authFetch } = useAuth();

	//connect to backend when component mounts
	useEffect(() => {
		authFetch(`http://localhost:8080/api/schedules/${user?.id}`)
			.then((response) => {
				if (!response.ok) throw new Error("Could not connect to server");
				return response.json();
			})
			//success
			.then((data) => {
				console.log(JSON.stringify(data));
				setLoading(false);
			})
			//error
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	return (
		<main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				<Logo />
				{getContent()}
			</div>
		</main>
	);

	function getContent() {
		if (error)
			return (
				<p role="alert" style={{ color: "crimson", margin: 0, textAlign: "center" }}>
					{error}
				</p>
			);
		if (loading) return <LoadingIndicator variant="Loading" />;
		return (
			<>
				<p className="text-center block text-lg font-medium text-gray-700 mb-5">Home</p>

				<p className="block text-center text-sm font-medium text-gray-700 mb-1">
					{user && (
						<>
							<br />
							Hello, {user.firstName}!
						</>
					)}
				</p>

				<Button onClick={manualLogout}>Log Out</Button>
			</>
		);
	}
}
