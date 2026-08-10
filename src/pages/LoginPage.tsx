import { Link } from "react-router-dom";
import Button from "../components/Button";
import { InputField } from "../components/InputField";
import { useState, type SubmitEvent } from "react";
import Logo from "../components/Logo";

export function LoginPage() {
	//email and password state for submit button
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	//error and loading state for server await and response
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

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
					email,
					password,
				}),
			});

			//response
			const data = await response.json();

			if (!response.ok) {
				setError(data.error ?? "Unable to log in.");
				return;
			}

			console.log("Logged in:", data);

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

				<form onSubmit={handleSubmit} className="space-y-5">
					{/* use state to set email and password for submit button to use */}
					<InputField variant="email" onChange={(e) => setEmail(e.currentTarget.value)} />
					<InputField variant="password" onChange={(e) => setPassword(e.currentTarget.value)} />

					{/* if error, display the text here */}
					{error && (
						<p role="alert" style={{ color: "crimson", margin: 0 }}>
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
			</div>
		</main>
	);
}
