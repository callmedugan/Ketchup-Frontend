import { format, isSameDay } from "date-fns";
import type { FriendSchedule, Schedule } from "../../utils/types";
import { useState } from "react";
import OverlapModal from "./OverlapModal";

type StickyNoteProps = {
	schedule: Schedule;
	allFriendSchedules: FriendSchedule[];
	onDeleted: (ScheduleId: string) => void;
};

export default function StickyNote({ schedule, allFriendSchedules, onDeleted }: StickyNoteProps) {
	//used to grey out the note if time has passed
	const hasPassed = schedule.endTime < new Date();

	const [isOpen, setIsOpen] = useState(false);

	//find all schedules for this day
	const overlapsForThisDay: FriendSchedule[] = [];
	for (const s of allFriendSchedules) {
		if (isSameDay(s.startTime, schedule.startTime)) overlapsForThisDay.push(s);
	}
	const overlapCount = overlapsForThisDay.length;

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
					{format(schedule.startTime, "p")} - {format(schedule.endTime, "p")}:
				</div>

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
					schedule={schedule}
					friends={overlapsForThisDay}
					onClose={() => setIsOpen(false)}
					onDeleted={onDeleted}
				/>
			)}
		</>
	);
}
