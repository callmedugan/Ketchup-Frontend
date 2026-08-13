import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import { useAuth } from "../contexts/AuthContext";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { getScheduleFromParsedJson, type Schedule } from "../utils/types";
import Calendar from "../components/Calendar";

export function HomePage() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { manualLogout, user, authFetch } = useAuth();

	/* ========================================================================= */
	//                        schedules
	/* ========================================================================= */

	const [schedules, setSchedules] = useState<Schedule[]>([]);
	// const addSchedule = (newSchedule: Schedule) => {
	// 	setSchedules((prevItems) => [...prevItems, newSchedule]);
	// };
	// const deleteSchedule = (idToDelete: string) => {
	// 	setSchedules((prevItems) => prevItems.filter((item) => item.id !== idToDelete));
	// };

	/* ========================================================================= */
	//                        useEffect when component mounts
	/* ========================================================================= */

	useEffect(() => {
		//console.log("Current user state:", user);
		if (!user) return;

		authFetch(`http://localhost:8080/api/schedules/${user?.id}`)
			.then((response) => {
				if (!response.ok) throw new Error("Could not connect to server");
				return response.json();
			})
			//success
			.then((data) => {
				//convert to array and assign to schedule state
				const scheduleData = getScheduleFromParsedJson(data);
				if (scheduleData == null) throw new Error("Schedule data invalid");
				setSchedules(scheduleData);
				setLoading(false);
			})
			//error
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [user]);

	/* ========================================================================= */
	//                        page
	/* ========================================================================= */

	return (
		<main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-lg">
				{/* ============================================================= */}
				{/* Header */}
				{/* ============================================================= */}

				<header className="flex items-center justify-between border-b border-gray-200 px-6 py-5 sm:px-8">
					<div>
						<Logo showTagLine={false} />
					</div>

					<button
						onClick={manualLogout}
						className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-red-600"
					>
						Log out
					</button>
				</header>

				{/* ============================================================= */}
				{/* Page content */}
				{/* ============================================================= */}

				{getContent()}
			</div>
		</main>
	);

	function getContent() {
		// error
		if (error)
			return (
				<div className="flex min-h-96 items-center justify-center px-6">
					<div className="text-center">
						<h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>

						<p role="alert" className="mt-2 text-sm text-red-600">
							{error}
						</p>
					</div>
				</div>
			);

		// loading
		if (loading)
			return (
				<div className="flex min-h-96 items-center justify-center">
					<LoadingIndicator variant="Loading" />
				</div>
			);

		//default
		return (
			<div className="px-6 py-6 sm:px-8 sm:py-8">
				{/* ========================================================= */}
				{/* Dashboard heading */}
				{/* ========================================================= */}

				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500">Your schedule</p>

						{user && (
							<h1 className="mt-1 text-2xl font-semibold text-gray-900">
								Hello, {user.name.split(" ")[0]}!
							</h1>
						)}
					</div>
				</div>

				{/* ========================================================= */}
				{/* Calendar card */}
				{/* ========================================================= */}

				<section className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
					<div className="p-3 sm:p-4">
						<Calendar schedules={schedules} />
					</div>
				</section>
			</div>
		);
	}
}
