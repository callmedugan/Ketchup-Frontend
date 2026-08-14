import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { getScheduleFromParsedJson, type Schedule } from "../utils/types";
import Calendar from "../components/Calendar";
import NavBar from "../components/NavBar";

export function HomePage() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { user, authFetch } = useAuth();

	/* ========================================================================= */
	//                        schedules
	/* ========================================================================= */

	const [schedules, setSchedules] = useState<Schedule[]>([]);

	/* ========================================================================= */
	//                        useEffect when component mounts
	/* ========================================================================= */

	useEffect(() => {
		if (!user) return;

		authFetch(`http://localhost:8080/api/schedules/${user.id}`)
			.then((response) => {
				if (!response.ok) throw new Error("Could not connect to server");
				return response.json();
			})
			.then((data) => {
				const scheduleData = getScheduleFromParsedJson(data);

				if (scheduleData == null) {
					throw new Error("Schedule data invalid");
				}

				setSchedules(scheduleData);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [user]);

	/* ========================================================================= */
	//                        page
	/* ========================================================================= */

	return (
		<div className="flex min-h-screen bg-[#b8794f] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12)_0_1px,transparent_1px),radial-gradient(circle_at_80%_70%,rgba(80,40,20,0.12)_0_1px,transparent_1px)] bg-size[11px_11px,17px_17px]">
			<NavBar />

			<main className="m-5 flex-1 overflow-hidden rounded-3xl border border-stone-300/70 bg-[#f7f1e5] shadow-[0_10px_30px_rgba(60,30,15,0.18)] lg:m-7">
				{getContent()}
			</main>
		</div>
	);

	function getContent() {
		/* --------------------------------------------------------------------- */
		// Error
		/* --------------------------------------------------------------------- */

		if (error) {
			return (
				<div className="flex min-h-96 items-center justify-center px-6">
					<div className="text-center">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
							!
						</div>

						<h2 className="mt-4 text-lg font-bold text-stone-900">Something went wrong</h2>

						<p role="alert" className="mt-2 text-sm text-red-600">
							{error}
						</p>
					</div>
				</div>
			);
		}

		/* --------------------------------------------------------------------- */
		// Loading
		/* --------------------------------------------------------------------- */

		if (loading) {
			return (
				<div className="flex min-h-96 items-center justify-center">
					<LoadingIndicator variant="Loading" />
				</div>
			);
		}

		/* --------------------------------------------------------------------- */
		// Default
		/* --------------------------------------------------------------------- */

		return (
			<div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
				{/* Dashboard heading */}
				<div className="mb-7">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
						Your calendar
					</p>

					{user && (
						<h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
							Hello, {user.name.split(" ")[0]}!
						</h1>
					)}

					<p className="mt-1 text-sm text-stone-500">
						Here&apos;s when you&apos;re available this week.
					</p>
				</div>

				{/* Calendar */}
				<section className="overflow-hidden rounded-2xl border border-stone-300/80 bg-white shadow-[0_4px_15px_rgba(60,30,15,0.08)]">
					<Calendar schedules={schedules} />
				</section>
			</div>
		);
	}
}
