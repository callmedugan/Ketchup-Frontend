import { useEffect, useState, type SubmitEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { getScheduleFromParsedJson, type Schedule, type ScheduleRepeatType } from "../utils/types";
import Calendar from "../components/Calendar";
import NavBar from "../components/NavBar";

export function HomePage() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { user, authFetch } = useAuth();

	/* ========================================================================= */
	// schedules
	/* ========================================================================= */

	const [schedules, setSchedules] = useState<Schedule[]>([]);

	/* ========================================================================= */
	// create schedule
	/* ========================================================================= */

	const [showScheduleForm, setShowScheduleForm] = useState(false);
	const [scheduleError, setScheduleError] = useState<string | null>(null);
	const [creatingSchedule, setCreatingSchedule] = useState(false);

	const [date, setDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [repeatType, setRepeatType] = useState<ScheduleRepeatType>("once");

	/* ========================================================================= */
	// useEffect when component mounts
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
				<div className="mb-7 flex items-end justify-between gap-4">
					<div>
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

					{/* Add availability */}
					<button
						type="button"
						onClick={() => {
							setScheduleError(null);
							setShowScheduleForm(true);
						}}
						className="shrink-0 rounded-xl bg-[#943b32] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f2f29] active:scale-95"
					>
						+ Add availability
					</button>
				</div>

				{/* Calendar */}
				<section className="overflow-hidden rounded-2xl border border-stone-300/80 bg-white shadow-[0_4px_15px_rgba(60,30,15,0.08)]">
					<Calendar schedules={schedules} />
				</section>
			</div>
		);
	}

	/* ========================================================================= */
	// create schedule form
	/* ========================================================================= */

	function showCreateScheduleForm() {
		return (
			<div
				className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 px-4 backdrop-blur-[2px]"
				onMouseDown={(event) => {
					if (event.target === event.currentTarget) {
						setShowScheduleForm(false);
					}
				}}
			>
				<div className="w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf8] shadow-2xl">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-[#7f2f29] bg-[#943b32] px-5 py-4">
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e9bdb4]">
								Your availability
							</p>

							<h2 className="text-xl font-bold text-[#fff3d6]">Add a schedule</h2>
						</div>

						<button
							type="button"
							onClick={() => setShowScheduleForm(false)}
							className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-[#f7ddd4] transition hover:bg-white/10 hover:text-white"
							aria-label="Close"
						>
							×
						</button>
					</div>

					<form onSubmit={handleCreateSchedule} className="space-y-5 p-5">
						{/* Date */}
						<div>
							<label
								htmlFor="schedule-date"
								className="mb-1.5 block text-sm font-bold text-stone-700"
							>
								Date
							</label>

							<input
								id="schedule-date"
								type="date"
								required
								value={date}
								onChange={(event) => setDate(event.target.value)}
								className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#b65a4f] focus:ring-2 focus:ring-[#b65a4f]/20"
							/>
						</div>

						{/* Times */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="schedule-start"
									className="mb-1.5 block text-sm font-bold text-stone-700"
								>
									Start
								</label>

								<input
									id="schedule-start"
									type="time"
									required
									value={startTime}
									onChange={(event) => setStartTime(event.target.value)}
									className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#b65a4f] focus:ring-2 focus:ring-[#b65a4f]/20"
								/>
							</div>

							<div>
								<label
									htmlFor="schedule-end"
									className="mb-1.5 block text-sm font-bold text-stone-700"
								>
									End
								</label>

								<input
									id="schedule-end"
									type="time"
									required
									value={endTime}
									onChange={(event) => setEndTime(event.target.value)}
									className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#b65a4f] focus:ring-2 focus:ring-[#b65a4f]/20"
								/>
							</div>
						</div>

						{/* Repeat */}
						<div>
							<label
								htmlFor="schedule-repeat"
								className="mb-1.5 block text-sm font-bold text-stone-700"
							>
								Repeat
							</label>

							<select
								id="schedule-repeat"
								value={repeatType}
								onChange={(event) => setRepeatType(event.target.value as ScheduleRepeatType)}
								className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#b65a4f] focus:ring-2 focus:ring-[#b65a4f]/20"
							>
								<option value="once">Doesn't repeat</option>
								<option value="daily">Every day</option>
								<option value="weekly">Every week</option>
							</select>
						</div>

						{/* Error */}
						{scheduleError && (
							<p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{scheduleError}</p>
						)}

						{/* Actions */}
						<div className="flex justify-end gap-2 border-t border-stone-200 pt-4">
							<button
								type="button"
								onClick={() => setShowScheduleForm(false)}
								className="rounded-xl px-4 py-2.5 text-sm font-bold text-stone-600 transition hover:bg-stone-100"
							>
								Cancel
							</button>

							<button
								type="submit"
								disabled={creatingSchedule}
								className="rounded-xl bg-[#943b32] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f2f29] disabled:cursor-not-allowed disabled:opacity-60"
							>
								{creatingSchedule ? "Adding..." : "Add availability"}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}

	/* ========================================================================= */
	// create schedule
	/* ========================================================================= */

	async function handleCreateSchedule(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!user) return;

		setScheduleError(null);

		const scheduleStart = new Date(`${date}T${startTime}`);
		const scheduleEnd = new Date(`${date}T${endTime}`);

		if (scheduleEnd <= scheduleStart) {
			setScheduleError("End time must be after start time.");
			return;
		}

		try {
			setCreatingSchedule(true);

			const response = await authFetch("http://localhost:8080/api/schedules", {
				method: "POST",

				headers: {
					"Content-Type": "application/json",
				},

				body: JSON.stringify({
					userId: user.id,
					startTime: scheduleStart.toISOString(),
					endTime: scheduleEnd.toISOString(),
					repeatType,
				}),
			});

			if (!response.ok) {
				throw new Error("Could not create schedule");
			}

			const data = await response.json();

			const newSchedules = getScheduleFromParsedJson(data);

			if (newSchedules == null || newSchedules.length === 0) {
				throw new Error("Schedule data invalid");
			}

			setSchedules((previous) => [...previous, newSchedules[0]]);

			resetScheduleForm();
			setShowScheduleForm(false);
		} catch (err) {
			setScheduleError(err instanceof Error ? err.message : "Could not create schedule");
		} finally {
			setCreatingSchedule(false);
		}
	}

	function resetScheduleForm() {
		setDate("");
		setStartTime("");
		setEndTime("");
		setRepeatType("once");
		setScheduleError(null);
	}
}
