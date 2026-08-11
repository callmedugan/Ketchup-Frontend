import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { InputField } from "../components/InputField";
import { useEffect, useState, type SubmitEvent } from "react";
import Logo from "../components/Logo";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
	//for routing
	const navigate = useNavigate();

	//email and password state for submit button
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	//error and loading state for server await and response
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	//auth
	const { login, token, isAuthenticated } = useAuth();

	// Retrieve original path or fallback to home
	const location = useLocation();
	const redirectPath = location.state?.from?.pathname || "/";

	//useeffect for waiting after success before routing to login page
	useEffect(() => {
		if (!isAuthenticated) return;

		// Wait 3 seconds, then route to the login page or previous page before being routed back to login
		const timer = setTimeout(() => {
			navigate(redirectPath, { replace: true }); // Use replace to clear login from history
		}, 3000);

		// Clean up the timer if the component unmounts early
		return () => clearTimeout(timer);
	}, [isAuthenticated, navigate]);

	//handler for submit button
	async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		//set states
		setError("");
		setIsLoading(true);

		const jwt = token;

		//try to connect to backend
		try {
			const response = await fetch("http://localhost:8080/auth/login", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email,
					password: password,
				}),
			});

			//response
			const data = await response.json();

			//error
			if (!response.ok) {
				setError(data.error ?? "Unable to log in.");
				return;
			}

			//success
			const token = data?.token;
			if (token != undefined) login(token);
		} catch {
			setError("Could not connect to the server.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				<Logo />

				{isAuthenticated ? (
					<LoadingIndicator variant="Login" />
				) : (
					<>
						<form onSubmit={handleSubmit} className="space-y-5">
							{/* use state to set email and password for submit button to use */}
							<InputField variant="email" onChange={(e) => setEmail(e.target.value)} />
							<InputField variant="password" onChange={(e) => setPassword(e.target.value)} />

							{/* if error, display the text here */}
							{error && (
								<p role="alert" style={{ color: "crimson", margin: 0, textAlign: "center" }}>
									{error}
								</p>
							)}

							{/* while waiting for resp disable the button */}
							<Button disabled={isLoading}>{isLoading ? "Logging in..." : "Log in"}</Button>
						</form>

						{/* link to register page */}
						<p className="text-center text-sm text-gray-500 mt-6">
							Don't have an account?{" "}
							<Link to="/register" className="font-medium text-red-500 hover:text-red-600">
								Sign up
							</Link>
						</p>
					</>
				)}
			</div>
		</main>
	);
}
