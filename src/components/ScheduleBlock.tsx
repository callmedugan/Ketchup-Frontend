import type { ComponentProps } from "react";
import type { Schedule } from "../utils/types";

type ButtonProps = {
	schedule?: Schedule;
} & ComponentProps<"li">;

export default function ScheduleBlock({ schedule, ...props }: ButtonProps) {
	return (
		<li
			{...props}
			className="w-full rounded-lg bg-red-500 py-2.5
                       font-semibold text-white
                       hover:bg-red-600
                       transition-colors
                       disabled:opacity-30
                       disabled:cursor-not-allowed 
                       text-center
                       "
		>
			{showContent()}
		</li>
	);

	function showContent() {
		if (schedule == undefined) {
			return <>{props.children}</>;
		}
		return <>{new Date(schedule.startTime).toDateString()}</>;
	}
}
