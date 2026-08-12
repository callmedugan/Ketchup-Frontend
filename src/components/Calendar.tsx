import { useState, type ComponentProps, type JSX } from "react";
import type { Schedule } from "../utils/types";
import { addDays, addWeeks, format, isSameDay, startOfWeek } from "date-fns";
import ScheduleBlock from "./ScheduleBlock";

type ButtonProps = {
	schedules: Schedule[];
} & ComponentProps<"li">;

export default function Calendar({ schedules, ...props }: ButtonProps) {
	//offset for showing different weeks
	const [weekOffset, setWeekOffset] = useState(0);

	//return
	return <>{showCalendarContainer()}</>;

	function showCalendarContainer() {
		// create week date array
		const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 0 });
		const weekDays: Date[] = [];

		for (let i = 0; i < 7; i++) {
			weekDays.push(addDays(weekStart, i));
		}

		return (
			<div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
				<div>{showDaysContainer(weekDays)}</div>
			</div>
		);
	}

	function showDaysContainer(dates: Date[]) {
		return (
			<>
				{dates.map((day, index) => (
					<div
						key={day.toISOString()}
						className={`
						flex min-h-24 border-b border-slate-200 last:border-b-0 bg-white
					`}
					>
						{showDayHeader(day, index)}
						<div className="flex flex-1 items-center">{showAvailableBlock(day)}</div>
					</div>
				))}
			</>
		);
	}

	function showDayHeader(day: Date, index: number) {
		return (
			<div
				className={`
				flex w-1/7 shrink-0 flex-col items-center justify-center
				border-r p-4 border-slate-200
			`}
			>
				<div className="text-sm font-medium uppercase tracking-wide">{format(day, "EEE")}</div>

				<div className="mt-1 text-2xl font-bold">{format(day, "d")}</div>
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
						//unique key
						key={`${s.id}-${day.toISOString()}-${s.startTime}`}
						className="flex items-center gap-1 p-2"
					>
						<div className="cursor-pointer rounded-xl border border-red-200 bg-red-50 p-4 transition hover:bg-red-100">
							<div className="font-semibold text-red-700">Available</div>

							<div className="mt-1 text-sm text-red-600">
								{format(s.startTime, "p")} - {format(s.endTime, "p")}
							</div>
						</div>
					</div>,
				);
			}
		}
		return result;
	}
}
