import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { InputField } from "../components/InputField";
import { useEffect, useState, type SubmitEvent } from "react";
import Logo from "../components/Logo";
import { LoadingIndicator } from "../components/LoadingIndicator";

export function LoginPage() {
	//for routing
	const navigate = useNavigate();

	//email and password state for submit button
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	//error and loading state for server await and response
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [wasSuccessful, setWasSuccessful] = useState(false);

	// Retrieve original path or fallback to home
	const location = useLocation();
	const redirectPath = location.state?.from?.pathname || "/";

	//useeffect for waiting after success before routing to login page
	useEffect(() => {
		if (!wasSuccessful) return;

		// Wait 5 seconds, then route to the login page or previous page before being routed back to login
		const timer = setTimeout(() => {
			navigate(redirectPath, { replace: true }); // Use replace to clear login from history
		}, 5000);

		// Clean up the timer if the component unmounts early
		return () => clearTimeout(timer);
	}, [wasSuccessful, navigate]);

	//handler for submit button
	async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		//set states
		setError("");
		setIsLoading(true);

		//try to connect to backend
		try {
			const response = await fetch("http://localhost:8080/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email,
					password: password,
				}),
			});

			//response
			const data = await response.json();

			if (!response.ok) {
				setError(data.error ?? "Unable to log in.");
				return;
			}

			//success
			//route to login page by setting successful to true
			setWasSuccessful(true);

			// TODO: handle storing the JWT and redirecting later.
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

				{wasSuccessful ? (
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
