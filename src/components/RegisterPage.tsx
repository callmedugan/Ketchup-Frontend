import Button from "./Button";
import { InputField } from "./InputField";

export function RegisterPage() {
	return (
		<main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-red-500">Ketchup</h1>
					<p className="text-gray-500 mt-2">Catch up with your friends</p>
				</div>

				<form className="space-y-5">
					<InputField variant="default">First Name</InputField>
					<InputField variant="default">Last Name</InputField>
					<InputField variant="email" placeholder="" />
					<InputField variant="password" placeholder="" />

					<Button>Submit</Button>
				</form>
			</div>
		</main>
	);
}
