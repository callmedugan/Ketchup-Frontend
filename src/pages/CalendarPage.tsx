import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Calendar from "../components/calendar/Calendar";
import NewScheduleModal from "../components/calendar/NewScheduleModal";
import PageContainer from "./PageContainer";

export function CalendarPage() {
	const { user } = useAuth();

	//used when adding schedule
	const [showScheduleForm, setShowScheduleForm] = useState(false);

	const [date] = useState("");

	/* ========================================================================= */
	// page
	/* ========================================================================= */

	return (
		<PageContainer>
			{getContent()}
			{showScheduleForm && showCreateScheduleForm()}
		</PageContainer>
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
						<p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">Your calendar</p>

						{user && <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-text">Hello, {user.name.split(" ")[0]}!</h1>}

						<p className="mt-1 text-sm font-medium text-brand-muted">Check out what's going on this week.</p>
					</div>

					{/* Add availability */}
					<button
						type="button"
						onClick={() => {
							setShowScheduleForm(true);
						}}
						className="btn-primary"
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
