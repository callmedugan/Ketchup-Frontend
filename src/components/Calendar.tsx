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
			<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
				{/* Date navigation */}
				<div className="flex min-h-16 items-center justify-between border-b border-stone-200 bg-linear-to-r from-stone-50 via-white to-stone-50 px-3 sm:px-5">
					{/* Previous week */}
					<button
						type="button"
						onClick={() => setWeekOffset((prev) => prev - 1)}
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition hover:border-stone-300 hover:bg-stone-100 hover:text-stone-800 active:scale-95"
						aria-label="Previous week"
					>
						<span className="text-xl leading-none">‹</span>
					</button>

					{/* Center section */}
					<div className="flex min-w-0 w-70 items-center justify-center gap-3 sm:w-100">
						{/* Date */}
						<h2 className="whitespace-nowrap text-center text-sm font-semibold tracking-tight text-stone-800 sm:text-lg">
							{format(weekDays[0], "MMMM")}
						</h2>

						{/* Today */}
						<button
							type="button"
							onClick={() => setWeekOffset(0)}
							disabled={weekOffset === 0}
							className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
								weekOffset === 0
									? "cursor-default bg-stone-200 text-stone-400"
									: "bg-red-500 text-white hover:bg-red-600 hover:shadow active:scale-95"
							}`}
						>
							This week
						</button>
					</div>

					{/* Next week */}
					<button
						type="button"
						onClick={() => setWeekOffset((prev) => prev + 1)}
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition hover:border-stone-300 hover:bg-stone-100 hover:text-stone-800 active:scale-95"
						aria-label="Next week"
					>
						<span className="text-xl leading-none">›</span>
					</button>
				</div>

				{/* Days */}
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
								className={`min-h-72 min-w-0 border-r border-stone-200 last:border-r-0 ${index % 2 === 0 ? "bg-white" : "bg-stone-50/70"}`}
							>
								{/* Day header */}
								<div className="border-b border-stone-200 px-2 py-3 text-center">
									<div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 sm:text-xs">
										{format(day, "EEE")}
									</div>

									<div
										className={`mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${isToday ? "bg-red-500 text-white shadow-sm" : "text-stone-700"}`}
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
			if (schedule.repeatType === "once") {
				// Only include one-time schedules that fall within this week
				const scheduleDate = format(schedule.startTime, "yyyy-MM-dd");

				const weekDates = Array.from({ length: 7 }, (_, i) =>
					format(addDays(weekStart, i), "yyyy-MM-dd"),
				);

				if (weekDates.includes(scheduleDate)) {
					weekSchedules.push(schedule);
				}
			}

			if (schedule.repeatType === "daily") {
				// Create a copy for each day
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
			<div className="relative min-w-0 max-w-full -rotate-1 overflow-hidden rounded-sm border border-amber-200 bg-amber-100 px-2 py-2 shadow-[2px_3px_6px_rgba(0,0,0,0.12)] transition duration-150 hover:-translate-y-0.5 hover:rotate-0 hover:shadow-[3px_5px_8px_rgba(0,0,0,0.15)]">
				{/* Folded corner */}
				<div className="absolute right-0 top-0 h-4 w-4 bg-amber-200 [clip-path:polygon(0_0,100%_0,100%_100%)]" />

				<div className="truncate text-xs font-semibold text-amber-950">Available</div>

				<div className="mt-0.5 truncate text-xs text-amber-800">
					{format(schedule.startTime, "p")} - {format(schedule.endTime, "p")}
				</div>
			</div>
		);
	}
}
