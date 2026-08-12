import { useState, type ComponentProps, type JSX } from "react";
import { type Schedule } from "../utils/types";
import { addDays, addWeeks, format, isSameDay, startOfWeek } from "date-fns";

type CalendarProps = {
	schedules: Schedule[];
} & ComponentProps<"li">;

export default function Calendar({ schedules }: CalendarProps) {
	//offset for showing different weeks
	const [weekOffset, setWeekOffset] = useState(0);

	//return
	return <>{showOutsideContainer()}</>;

	function showOutsideContainer() {
		// create week date array
		const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 0 });
		const weekDays: Date[] = [];

		for (let i = 0; i < 7; i++) {
			weekDays.push(addDays(weekStart, i));
		}

		//this is just the main outside container
		return (
			<div className="mt-8 mb-8 overflow-hidden rounded-2xl border border-black-400 shadow-sm ring-1 ring-gray-300">
				<button
					onClick={() => setWeekOffset((prev) => prev - 1)}
					className="flex h-8 w-full items-center justify-center border-b 
					border-slate-500 bg-indigo-200 text-gray-500 transition hover:bg-indigo-300 hover:text-gray-700"
				>
					↑
				</button>
				<div>{showDayRows(weekDays)}</div>
				<button
					onClick={() => setWeekOffset((prev) => prev + 1)}
					className="flex h-8 w-full items-center justify-center border-t 
					border-slate-500 bg-indigo-200 text-gray-500 transition hover:bg-indigo-300 hover:text-gray-700"
				>
					↓
				</button>
			</div>
		);
	}

	function showDayRows(dates: Date[]) {
		return (
			<>
				{/* month row*/}
				<div className="flex min-h-8 items-center justify-center border-b border-slate-500 bg-indigo-200 px-4">
					{dates.length > 0 && (
						<span className="text-lg font-semibold text-slate-700">
							{format(dates[0], "MMMM yyyy")}
						</span>
					)}
				</div>

				{/* day rows */}
				{dates.map((day) => (
					<div
						key={day.toISOString()}
						className={`
						flex min-h-24 border-b border-slate-500 last:border-b-0 bg-slate-100 
					`}
					>
						{showDayHeader(day)}
						<div className="flex flex-1 items-center p-1.5 gap-1.5">{showAvailableBlock(day)}</div>
					</div>
				))}
			</>
		);
	}

	function showDayHeader(day: Date) {
		return (
			<div
				className={`
				flex w-1/7 shrink-0 flex-col items-center justify-center
				border-r p-4 border-slate-500 bg-indigo-200
			`}
			>
				<div className="text-med font-medium uppercase tracking-wide">{format(day, "EEE")}</div>

				<div className="mt-1 text-3xl font-bold">{format(day, "d")}</div>
			</div>
		);
	}

	function showAvailableBlock(day: Date) {
		//loop through schedule and see if any blocks are on this day and build a list of block items
		const result: JSX.Element[] = [];

		for (const s of schedules) {
			if (isSameDay(s.startTime, day)) {
				result.push(
					<div
						key={`${s.id}-${day.toISOString()}-${s.startTime}`}
						className="relative w-full h-full cursor-pointer overflow-hidden
							rounded-xl border border-slate-500 bg-sky-700 p-4 transition 
							hover:bg-sky-800 shadow-sm ring-1 ring-gray-300"
					>
						<div className="font-semibold text-white">Available</div>

						<div className="mt-1 text-sm font-medium text-red-50">
							{format(s.startTime, "p")} - {format(s.endTime, "p")}
						</div>

						{/* Emoji sidebar */}
						<div
							className="absolute right-0 top-0 flex h-full w-12
							flex-col pl-1 justify-center gap-1  
							border-l border-slate-500  bg-sky-200"
						>
							<span className="text-2xl">{availabilityStatus.interested}</span>
							<span className="text-2xl">{availabilityStatus.matched}</span>
							<span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-med text-white">
								3
							</span>
							<span className="absolute right-2 top-12 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-med text-white">
								1
							</span>
						</div>
					</div>,
				);
			}
		}
		return result;
	}
}

const availabilityStatus = {
	interested: "👋",
	matched: "🤝",
};
