import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { InputField } from "../components/InputField";
import Logo from "../components/Logo";
import { useEffect, useState, type SubmitEvent } from "react";
import { LoadingIndicator } from "../components/LoadingIndicator";

export function RegisterPage() {
	//for routing
	const navigate = useNavigate();

	//states for various fields
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	//error and loading state for server await and response
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [wasSuccessful, setWasSuccessful] = useState(false);

	//useeffect for waiting after success before routing to login page
	useEffect(() => {
		if (!wasSuccessful) return;

		// Wait 5 seconds, then route to the login page
		const timer = setTimeout(() => {
			navigate("/login");
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
			const response = await fetch("http://localhost:8080/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: `${firstName} ${lastName}`,
					email: email,
					password: password,
				}),
			});

			//response
			const data = await response.json();

			if (!response.ok) {
				setError(data.error ?? "Unable to create new user.");
				return;
			}

			//route to login page by setting successful to true
			setWasSuccessful(true);
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
					<LoadingIndicator variant="Register" />
				) : (
					<>
						<form onSubmit={handleSubmit} className="space-y-5">
							<InputField variant="firstName" onChange={(e) => setFirstName(e.target.value)}>
								First Name
							</InputField>
							<InputField variant="lastName" onChange={(e) => setLastName(e.target.value)}>
								Last Name
							</InputField>
							<InputField
								variant="email"
								placeholder=""
								onChange={(e) => setEmail(e.target.value)}
							/>
							<InputField
								variant="password"
								autoComplete="new-password"
								placeholder=""
								onChange={(e) => setPassword(e.target.value)}
							/>

							{/* if error, display the text here */}
							{error && (
								<p role="alert" style={{ color: "crimson", margin: 0, textAlign: "center" }}>
									{error}
								</p>
							)}

							{/* while waiting for resp disable the button */}
							<Button disabled={isLoading}>
								{isLoading ? "Creating account..." : "Create account"}
							</Button>
						</form>

						<p className="text-center text-sm text-gray-500 mt-6">
							Already have an account?{" "}
							<Link to="/login" className="font-medium text-red-500 hover:text-red-600">
								Log in
							</Link>
						</p>
					</>
				)}
			</div>
		</main>
	);
}
