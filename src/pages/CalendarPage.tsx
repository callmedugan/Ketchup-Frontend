import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Calendar from "../components/calendar/Calendar";
import NavBar from "../components/NavBar";
import NewScheduleModal from "../components/calendar/NewScheduleModal";

export function CalendarPage() {
	const { user } = useAuth();

	//used when adding schedule
	const [showScheduleForm, setShowScheduleForm] = useState(false);

	const [date] = useState("");

	/* ========================================================================= */
	// page
	/* ========================================================================= */

	return (
		<div className="flex min-h-screen bg-[#b8794f] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12)_0_1px,transparent_1px),radial-gradient(circle_at_80%_70%,rgba(80,40,20,0.12)_0_1px,transparent_1px)] bg-size[11px_11px,17px_17px]">
			<NavBar />

			<main className="m-5 flex-1 overflow-hidden rounded-3xl border border-stone-300/70 bg-[#f7f1e5] shadow-[0_10px_30px_rgba(60,30,15,0.18)] lg:m-7">
				{getContent()}
			</main>

			{/* Create schedule modal */}
			{showScheduleForm && showCreateScheduleForm()}
		</div>
	);

	/* ========================================================================= */
	// content
	/* ========================================================================= */

	function getContent() {
		return (
			<div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
				{/* Dashboard heading */}
				<div className="mb-7 flex items-end justify-between gap-4">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Your calendar</p>

						{user && <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">Hello, {user.name.split(" ")[0]}!</h1>}

						<p className="mt-1 text-sm text-stone-500">Check out what's going on this week.</p>
					</div>

					{/* Add availability */}
					<button
						type="button"
						onClick={() => {
							setShowScheduleForm(true);
						}}
						className="shrink-0 rounded-xl bg-[#943b32] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f2f29] active:scale-95"
					>
						+ Add availability
					</button>
				</div>

				{/* Calendar */}
				<section className="overflow-hidden rounded-2xl border border-stone-300/80 bg-white shadow-[0_4px_15px_rgba(60,30,15,0.08)]">
					<Calendar />
				</section>
			</div>
		);
	}

	/* ========================================================================= */
	// create schedule form
	/* ========================================================================= */

	function showCreateScheduleForm() {
		return <NewScheduleModal initialDate={date} onClose={() => setShowScheduleForm(false)} />;
	}
}
