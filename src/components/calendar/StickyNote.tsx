import { format, set } from "date-fns";
import { useState } from "react";
import OverlapModal from "./OverlapModal";
import { useSchedule } from "../../contexts/SchedulesContext";

type StickyNoteProps = {
	scheduleId: string;
	date: Date;
	onDeleted: () => void;
};

export default function StickyNote({ scheduleId, date, onDeleted }: StickyNoteProps) {
	const [error, setError] = useState<string | null>(null);
	const { getUserScheduleById, matchedSchedules } = useSchedule();

	const noteSchedule = getUserScheduleById(scheduleId);
	if (noteSchedule === undefined) {
		setError("Invalid schedule ID: " + scheduleId);
		throw new Error("Invalid schedule ID: " + scheduleId);
	}

	//used to grey out the note if time has passed
	const scheduleTime = set(date, {
		hours: noteSchedule.endTime.getHours(),
		minutes: noteSchedule.endTime.getMinutes(),
	});
	const hasPassed = scheduleTime <= new Date();

	const [isOpen, setIsOpen] = useState(false);

	//get number of unique users and overlaps for the day
	const overlapsForThisDay = [];
	const users = new Set();
	for (const s of matchedSchedules) {
		//skip anything not related to this day
		if (s.userScheduleIdMatched === noteSchedule.id) {
			overlapsForThisDay.push(s);
			users.add(s.userId);
		}
	}
	//finally
	const overlapCount = users.size;

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
					{format(noteSchedule.startTime, "p")} - {format(noteSchedule.endTime, "p")}:
				</div>

				{/* error */}
				{error && (
					<p role="alert" className="mt-2 text-sm text-red-600">
						{error}
					</p>
				)}

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
					noteSchedule={noteSchedule}
					hasPassed={hasPassed}
					overlaps={overlapsForThisDay}
					onClose={() => setIsOpen(false)}
					onDeleted={onDeleted}
				/>
			)}
		</>
	);
}
