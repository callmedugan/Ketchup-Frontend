import { useEffect, useMemo, useState } from "react";
import { addDays, addWeeks, format, set, startOfWeek } from "date-fns";
import {
	getFriendSchedulesFromParsedJson,
	type FriendSchedule,
	type Schedule,
} from "../../utils/types";
import StickyNote from "./StickyNote";
import { useAuth } from "../../contexts/AuthContext";
import { LoadingIndicator } from "../LoadingIndicator";

type CalendarProps = {
	schedules: Schedule[];
	onDeleted: (ScheduleId: string) => void;
};

export default function Calendar({ schedules, onDeleted }: CalendarProps) {
	//standard
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	//others
	const [weekOffset, setWeekOffset] = useState(0);
	const currentSchedules = useMemo(buildSchedulesForWeek, [weekOffset, schedules]);
	const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 0 });
	const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
	//store fetch req
	const [friendSchedules, setFriendSchedules] = useState<FriendSchedule[]>([]);

	const { user, authFetch } = useAuth();

	/* ========================================================================= */
	// useEffect when component mounts
	/* ========================================================================= */

	useEffect(() => {
		fetchFriendSchedules();
	}, [user]);

	function fetchFriendSchedules() {
		if (!user) return;

		//add start and end query params
		const params = new URLSearchParams({
			start: weekStart.toDateString(),
			end: addWeeks(weekStart, 1).toDateString(),
		});

		authFetch(`${import.meta.env.VITE_API_URL}/api/friends/overlap?${params}`)
			.then((response) => {
				if (!response.ok) throw new Error("Could not connect to server");

				return response.json();
			})
			.then((data) => {
				const scheduleData = getFriendSchedulesFromParsedJson(data);

				if (scheduleData == null) throw new Error("Schedule data invalid");

				setFriendSchedules(scheduleData);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}

	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
				{/* ========================================================= */}
				{/* Date navigation */}
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
						<h2 className="whitespace-nowrap text-2xl font-bold tracking-tight text-[#fff3d6] sm:text-3xl">
							{format(weekDays[0], "MMMM yyyy")}
						</h2>

						<button
							type="button"
							onClick={() => setWeekOffset(0)}
							disabled={weekOffset === 0}
							className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
								weekOffset === 0
									? "cursor-default bg-white/10 text-white/40"
									: "bg-[#fff3d6] text-[#943b32] shadow-sm hover:bg-white active:scale-95"
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
								<div className="border-b border-stone-200/80 bg-[#f3e4d7] px-2 py-3 text-center">
									<div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8b6259] sm:text-xs">
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
									{daySchedules.map((schedule) => (
										<StickyNote
											key={schedule.id}
											schedule={schedule}
											allFriendSchedules={friendSchedules}
											onDeleted={onDeleted}
										/>
									))}
								</div>
							</div>
						);
					})}
					{showLoading()}
					{showError()}
				</div>
			</div>
		</div>
	);

	function buildSchedulesForWeek() {
		const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), {
			weekStartsOn: 0,
		});

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

	function showLoading() {
		if (loading) {
			return (
				<>
					<div className="flex min-h-96 items-center justify-center">
						<LoadingIndicator variant="Loading" />
					</div>
				</>
			);
		}
	}
	function showError() {
		if (error) {
			return (
				<>
					<div role="alert" className="mt-3  px-4 py-3 text-center text-sm text-red-700">
						{error}
					</div>
				</>
			);
		}
	}
}
