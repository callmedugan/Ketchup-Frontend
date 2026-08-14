import { useMemo, useState } from "react";
import { addDays, addWeeks, format, set, startOfWeek } from "date-fns";
import type { Schedule } from "../utils/types";

type CalendarProps = {
	schedules: Schedule[];
};

export default function Calendar({ schedules }: CalendarProps) {
	const [weekOffset, setWeekOffset] = useState(0);

	const currentSchedules = useMemo(buildSchedulesForWeek, [weekOffset, schedules]);

	const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 0 });

	const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
				{/* ========================================================= */}
				{/* Date navigation */}
				{/* ========================================================= */}

				<div className="flex min-h-20 items-center justify-between border-b border-stone-200 bg-[#fffdf8] px-3 sm:px-5">
					{/* Previous week */}
					<button
						type="button"
						onClick={() => setWeekOffset((prev) => prev - 1)}
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 active:scale-95"
						aria-label="Previous week"
					>
						<span className="mb-1 text-xl leading-none">‹</span>
					</button>

					{/* Center */}
					<div className="flex min-w-0 items-center justify-center gap-3">
						<h2 className="whitespace-nowrap text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
							{format(weekDays[0], "MMMM yyyy")}
						</h2>

						<button
							type="button"
							onClick={() => setWeekOffset(0)}
							disabled={weekOffset === 0}
							className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
								weekOffset === 0
									? "cursor-default bg-stone-100 text-stone-400"
									: "bg-[#d94b3d] text-white shadow-sm hover:bg-[#c94034] active:scale-95"
							}`}
						>
							This week
						</button>
					</div>

					{/* Next week */}
					<button
						type="button"
						onClick={() => setWeekOffset((prev) => prev + 1)}
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 active:scale-95"
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

						const daySchedules = currentSchedules.filter(
							(schedule) =>
								schedule.startTime.getFullYear() === day.getFullYear() &&
								schedule.startTime.getMonth() === day.getMonth() &&
								schedule.startTime.getDate() === day.getDate(),
						);

						return (
							<div
								key={day.toISOString()}
								className={`min-h-72 min-w-0 border-r border-stone-200/80 last:border-r-0 ${
									index % 2 === 0 ? "bg-[#fffdf9]" : "bg-[#faf7f0]"
								}`}
							>
								{/* Day header */}
								<div className="border-b border-stone-200/80 px-2 py-3 text-center">
									<div className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400 sm:text-xs">
										{format(day, "EEE")}
									</div>

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
									{daySchedules.map((schedule) => showStickyNote(schedule))}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);

	function buildSchedulesForWeek() {
		const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 0 });

		const weekSchedules: Schedule[] = [];

		for (const schedule of schedules) {
			/* ------------------------------------------------------------- */
			// Once
			/* ------------------------------------------------------------- */

			if (schedule.repeatType === "once") {
				const scheduleDate = format(schedule.startTime, "yyyy-MM-dd");

				const weekDates = Array.from({ length: 7 }, (_, i) =>
					format(addDays(weekStart, i), "yyyy-MM-dd"),
				);

				if (weekDates.includes(scheduleDate)) {
					weekSchedules.push(schedule);
				}
			}

			/* ------------------------------------------------------------- */
			// Daily
			/* ------------------------------------------------------------- */

			if (schedule.repeatType === "daily") {
				for (let i = 0; i < 7; i++) {
					const day = addDays(weekStart, i);

					weekSchedules.push({
						...schedule,

						startTime: set(day, {
							hours: schedule.startTime.getHours(),
							minutes: schedule.startTime.getMinutes(),
							seconds: schedule.startTime.getSeconds(),
							milliseconds: schedule.startTime.getMilliseconds(),
						}),

						endTime: set(day, {
							hours: schedule.endTime.getHours(),
							minutes: schedule.endTime.getMinutes(),
							seconds: schedule.endTime.getSeconds(),
							milliseconds: schedule.endTime.getMilliseconds(),
						}),
					});
				}
			}

			/* ------------------------------------------------------------- */
			// Weekly
			/* ------------------------------------------------------------- */

			if (schedule.repeatType === "weekly") {
				for (let i = 0; i < 7; i++) {
					const day = addDays(weekStart, i);

					if (day.getDay() === schedule.startTime.getDay()) {
						weekSchedules.push({
							...schedule,

							startTime: set(day, {
								hours: schedule.startTime.getHours(),
								minutes: schedule.startTime.getMinutes(),
								seconds: schedule.startTime.getSeconds(),
								milliseconds: schedule.startTime.getMilliseconds(),
							}),

							endTime: set(day, {
								hours: schedule.endTime.getHours(),
								minutes: schedule.endTime.getMinutes(),
								seconds: schedule.endTime.getSeconds(),
								milliseconds: schedule.endTime.getMilliseconds(),
							}),
						});
					}
				}
			}
		}

		return weekSchedules;
	}

	function showStickyNote(schedule: Schedule) {
		return (
			<div
				key={`${schedule.id}-${schedule.startTime.toISOString()}`}
				className="relative min-w-0 max-w-full -rotate-1 overflow-hidden rounded-sm border border-[#e7d49b] bg-[#fff3bd] px-3 py-2.5 shadow-[2px_3px_6px_rgba(0,0,0,0.12)] transition duration-150 hover:-translate-y-0.5 hover:rotate-0 hover:shadow-[3px_5px_8px_rgba(0,0,0,0.15)]"
			>
				{/* Folded corner */}
				<div className="absolute right-0 top-0 h-4 w-4 bg-[#eadb9e] [clip-path:polygon(0_0,100%_0,100%_100%)]" />

				<div className="truncate text-xs font-bold text-[#66531c]">Available</div>

				<div className="mt-0.5 truncate text-xs text-[#806b2a]">
					{format(schedule.startTime, "p")} - {format(schedule.endTime, "p")}
				</div>
			</div>
		);
	}
}
