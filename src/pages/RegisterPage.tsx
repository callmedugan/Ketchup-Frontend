import { Link } from "react-router-dom";
import Button from "../components/Button";
import { InputField } from "../components/InputField";
import Logo from "../components/Logo";

export function RegisterPage() {
	return (
		<main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				<Logo />

				<form className="space-y-5">
					<InputField variant="default">First Name</InputField>
					<InputField variant="default">Last Name</InputField>
					<InputField variant="email" placeholder="" />
					<InputField variant="password" placeholder="" />

					<Button>Submit</Button>
				</form>

				<p className="text-center text-sm text-gray-500 mt-6">
					Already have an account?{" "}
					<Link to="/login" className="font-medium text-red-500 hover:text-red-600">
						Log in
					</Link>
				</p>
			</div>
		</main>
	);
}
