import Logo from "../components/Logo";

export function HomePage() {
	return (
		<main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				<Logo />

				<p className="block text-center text-sm font-medium text-gray-700 mb-1">Home Page</p>
			</div>
		</main>
	);
}
