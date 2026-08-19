import { useMemo, useState } from "react";
import { addDays, addWeeks, format, isAfter, isBefore, set, startOfDay, startOfWeek } from "date-fns";
import { type Schedule } from "../../utils/types";
import StickyNote from "./StickyNote";
import { useSchedule } from "../../contexts/SchedulesContext";
import { LoadingIndicator } from "../LoadingIndicator";

export default function Calendar() {
	//standard
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { fetchUserSchedules } = useSchedule();
	const { userSchedules } = useSchedule();

	//changed with buttons
	const [weekOffset, setWeekOffset] = useState(0);

	//this is an array of schedule objects built for this week
	const weekSchedule = useMemo(buildWeekSchedule, [weekOffset, userSchedules]);

	//used to draw the calendar
	const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 0 });
	const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

	/* --------------------------------------------------------------------- */
	// Error
	/* --------------------------------------------------------------------- */

	if (error) {
		return (
			<div className="flex min-h-96 items-center justify-center px-6">
				<div className="text-center">
					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">!</div>

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

	/* ========================================================================= */
	//                        default
	/* ========================================================================= */

	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
				{/* ========================================================= */}
				{/* header */}
				{/* ========================================================= */}

				<div className="flex min-h-20 items-center justify-between border-b border-[#7f2f29] bg-[#943b32] px-3 sm:px-5">
					{/* Previous week */}
					<button
						type="button"
						onClick={() => setWeekOffset((prev) => prev - 1)}
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#fff3d6] transition hover:bg-white/20 hover:text-white active:scale-95"
						aria-label="Previous week"
					>
						<span className="mb-1 text-xl leading-none">‹</span>
					</button>

					{/* Center */}
					<div className="flex min-w-0 items-center justify-center gap-3">
						<h2 className="whitespace-nowrap text-2xl font-bold tracking-tight text-[#fff3d6] sm:text-3xl">{format(weekDays[0], "MMMM yyyy")}</h2>

						<button
							type="button"
							onClick={() => setWeekOffset(0)}
							disabled={weekOffset === 0}
							className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
								weekOffset === 0 ? "cursor-default bg-white/10 text-white/40" : "bg-[#fff3d6] text-[#943b32] shadow-sm hover:bg-white active:scale-95"
							}`}
						>
							This week
						</button>
					</div>

					{/* Next week */}
					<button
						type="button"
						onClick={() => setWeekOffset((prev) => prev + 1)}
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#fff3d6] transition hover:bg-white/20 hover:text-white active:scale-95"
						aria-label="Next week"
					>
						<span className="mb-1 text-xl leading-none">›</span>
					</button>
				</div>

				{/* ========================================================= */}
				{/* Days */}
				{/* ========================================================= */}

				<div className="grid grid-cols-7">
					{weekDays.map((day, index) => {
						const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

						const daySchedules = weekSchedule.filter(
							(schedule) =>
								schedule.startTime.getFullYear() === day.getFullYear() &&
								schedule.startTime.getMonth() === day.getMonth() &&
								schedule.startTime.getDate() === day.getDate(),
						);

						return (
							<div
								key={day.toISOString()}
								className={`min-h-72 min-w-0 border-r border-stone-200/80 last:border-r-0 ${index % 2 === 0 ? "bg-[#fffdf9]" : "bg-[#faf7f0]"}`}
							>
								{/* Day header */}
								<div className="border-b border-stone-200/80 bg-[#f3e4d7] px-2 py-3 text-center">
									<div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8b6259] sm:text-xs">{format(day, "EEE")}</div>

									<div
										className={`mx-auto mt-1 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
											isToday ? "bg-[#d94b3d] text-white shadow-sm" : "text-stone-700"
										}`}
									>
										{format(day, "d")}
									</div>
								</div>

								{/* Availability */}
								<div className="flex flex-col gap-3 p-3">
									{daySchedules.map((schedule) => (
										<StickyNote key={schedule.id} scheduleId={schedule.id} date={day} onDeleted={handleScheduleDeleted} />
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);

	function buildWeekSchedule() {
		//find the first day of the week
		const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), {
			weekStartsOn: 0,
		});

		const weekEnd = addWeeks(weekStart, 1);

		//create an array to store
		const result: Schedule[] = [];

		for (const s of userSchedules) {
			/* ------------------------------------------------------------- */
			// Once
			/* ------------------------------------------------------------- */

			//if between the week then add
			if (s.repeatType === "once") {
				if (isAfter(s.startTime, weekStart) && isBefore(s.endTime, weekEnd)) result.push(s);
			}

			/* ------------------------------------------------------------- */
			// Daily
			/* ------------------------------------------------------------- */
			//duplicate 7 times and change the day
			else if (s.repeatType === "daily") {
				for (let i = 0; i < 7; i++) {
					const day = addDays(weekStart, i);

					//skip if schedule starts later
					if (startOfDay(day) < startOfDay(s.startTime)) continue;

					result.push({
						...s,
						startTime: set(day, {
							hours: s.startTime.getHours(),
							minutes: s.startTime.getMinutes(),
						}),
						endTime: set(day, {
							hours: s.endTime.getHours(),
							minutes: s.endTime.getMinutes(),
						}),
					});
				}
			}

			/* ------------------------------------------------------------- */
			// Weekly
			/* ------------------------------------------------------------- */
			//just get the day of the week and offset the week start by that amount
			else if (s.repeatType === "weekly") {
				const day = addDays(weekStart, s.startTime.getDay());

				//skip if schedule starts later
				if (startOfDay(day) < startOfDay(s.startTime)) continue;

				result.push({
					...s,
					startTime: set(day, {
						hours: s.startTime.getHours(),
						minutes: s.startTime.getMinutes(),
					}),
					endTime: set(day, {
						hours: s.endTime.getHours(),
						minutes: s.endTime.getMinutes(),
					}),
				});
			}
		}

		//return sorted so that times will show up in order
		return result.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
	}

	//called when a schedule is deleted in calendar
	function handleScheduleDeleted() {
		setLoading(true);
		fetchUserSchedules()
			.catch((err) => {
				setError(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}
}
