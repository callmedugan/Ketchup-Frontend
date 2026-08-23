import { format, isBefore, isSameDay, set, startOfDay } from "date-fns";
import { useState } from "react";
import OverlapModal from "./OverlapModal";
import { useSchedule } from "../../contexts/SchedulesContext";
import type { MatchedSchedule, Schedule } from "../../utils/types";

type StickyNoteProps = {
	scheduleData: Schedule;
	noteDate: Date;
	onDeleted: () => void;
};

export default function StickyNote({ scheduleData, noteDate, onDeleted }: StickyNoteProps) {
	const { matchedSchedules } = useSchedule();
	const [isOpen, setIsOpen] = useState(false);

	//create a date for the beginning and end
	const noteStartTime = set(noteDate, {
		hours: scheduleData.startTime.getHours(),
		minutes: scheduleData.startTime.getMinutes(),
	});
	const noteEndTime = set(noteDate, {
		hours: scheduleData.endTime.getHours(),
		minutes: scheduleData.endTime.getMinutes(),
	});
	const hasPassed = noteEndTime <= new Date();

	const { overlapsForThisDay, overlapCount } = getValidAndSortedOverlaps(matchedSchedules, scheduleData, noteDate);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className={`
				relative min-h-25 min-w-0 max-w-full -rotate-1 overflow-hidden
				rounded-sm border border-[#e7d49b] bg-[#fff3bd]
				px-3 py-2.5 text-left
				shadow-[2px_3px_6px_rgba(0,0,0,0.12)]
				transition duration-150
				hover:-translate-y-0.5 hover:rotate-0
				hover:shadow-[3px_5px_8px_rgba(0,0,0,0.15)]
				${hasPassed ? "opacity-50" : "opacity-100"}
			`}
			>
				{/* corner */}
				<div className="absolute right-0 top-0 h-4 w-4 bg-[#e8c95b] [clip-path:polygon(0_0,100%_0,100%_100%)]" />

				{/* date */}
				<div className="absolute left-3 top-2.5 truncate text-xs font-bold text-[#66531c]">
					{format(scheduleData.startTime, "p")} - {format(scheduleData.endTime, "p")}:
				</div>

				{/* error */}
				{/* {error && (
					<p role="alert" className="mt-2 text-sm text-red-600">
						{error}
					</p>
				)} */}

				{/* friends free */}
				{overlapCount > 0 && !hasPassed && (
					<div className=" absolute inset-x-2 bottom-2 animate-float-notification truncate rounded-full border border-[#e0c96f] bg-white/70 px-2 py-1 text-center text-xs font-semibold text-[#66531c]">
						{overlapCount} friend{overlapCount > 1 && "s"} free!
					</div>
				)}
			</button>
			{/* overlap modal */}
			{isOpen && (
				<OverlapModal
					noteSchedule={scheduleData}
					hasPassed={hasPassed}
					noteStartTime={noteStartTime}
					noteEndTime={noteEndTime}
					noteOverlaps={overlapsForThisDay}
					onClose={() => setIsOpen(false)}
					onDeleted={onDeleted}
				/>
			)}
		</>
	);
}

function getValidAndSortedOverlaps(matchedSchedules: MatchedSchedule[], scheduleData: Schedule, noteDate: Date) {
	// get number of unique users and overlaps for the day
	const preSortedOverlaps = [];
	const users = new Set();
	for (const s of matchedSchedules) {
		//only check matching ids
		if (s.userScheduleIdMatched !== scheduleData.id) continue;

		// Note date cannot be before the match starts
		if (isBefore(startOfDay(noteDate), startOfDay(s.startTime))) continue;

		// Daily = every day after start
		// Once = exact date only
		// Weekly = matching weekday after start
		if (
			s.repeatType === "daily" ||
			(s.repeatType === "once" && isSameDay(s.startTime, noteDate)) ||
			(s.repeatType === "weekly" && s.startTime.getDay() === noteDate.getDay())
		) {
			preSortedOverlaps.push(s);
			users.add(s.userId);
		}
	}
	//finally
	return {
		overlapsForThisDay: preSortedOverlaps.sort((a, b) => a.startTime.getTime() - a.endTime.getTime() - (b.startTime.getTime() - b.endTime.getTime())),
		overlapCount: users.size,
	};
}
