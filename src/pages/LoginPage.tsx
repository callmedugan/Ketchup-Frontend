import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { InputField } from "../components/InputField";
import { useRef, useState, type SubmitEvent } from "react";
import Logo from "../components/Logo";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
	//for routing
	const navigate = useNavigate();

	//email and password refs for submit button
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	//error and loading state for server await and response
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	//auth
	const { login, token, isAuthenticated, authFetch } = useAuth();

	// Retrieve original path or fallback to home
	const location = useLocation();
	const redirectPath = location.state?.from?.pathname || "/";

	/* ========================================================================= */
	//                        submit handler
	/* ========================================================================= */

	//handler for submit button
	async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		//set states
		setError("");
		setIsLoading(true);

		//try to connect to backend
		try {
			const response = await authFetch("http://localhost:8080/auth/login", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: emailRef.current?.value,
					password: passwordRef.current?.value,
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
			const newToken = data?.token;
			if (newToken != undefined) {
				login(newToken);
				navigate(redirectPath, { replace: true });
			}
		} catch {
			setError("Could not connect to the server.");
		} finally {
			setIsLoading(false);
		}
	}
	/* ========================================================================= */
	//                        return
	/* ========================================================================= */

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
							<InputField variant="email" ref={emailRef} />
							<InputField variant="password" ref={passwordRef} />

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
