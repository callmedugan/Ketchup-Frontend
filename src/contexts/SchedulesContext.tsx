import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
	getMatchedSchedulesFromParsedJson,
	getScheduleFromParsedJson,
	type MatchedSchedule,
	type Schedule,
	type ScheduleRepeatType,
} from "../utils/types";
import { useAuth } from "./AuthContext";

/* ========================================================================= */
//                        context
/* ========================================================================= */

//#region context
type ScheduleContextType = {
	userSchedules: Schedule[];
	getUserScheduleById: (id: string) => Schedule | undefined;
	matchedSchedules: MatchedSchedule[];
	fetchUserSchedules: () => Promise<Schedule[]>;
	fetchMatchedSchedules: () => Promise<MatchedSchedule[]>;
	deleteUserSchedule: (id: string) => Promise<Schedule[]>;
	addUserSchedule: (userId: string, date: string, startTime: string, endTime: string, repeatType: ScheduleRepeatType) => Promise<Schedule[]>;
};

const ScheduleContext = createContext<ScheduleContextType | null>(null);

//#endregion

/* ========================================================================= */
//                        provider
/* ========================================================================= */

//#region provider
type ScheduleProviderProps = {
	children: ReactNode;
};

export const ScheduleProvider = ({ children }: ScheduleProviderProps) => {
	//needs to be nested inside auth provider
	const { user, authFetch } = useAuth();

	const [userSchedules, setUserSchedules] = useState<Schedule[]>([]);
	const [matchedSchedules, setMatchedSchedules] = useState<MatchedSchedule[]>([]);

	//fetch schedules when user updates
	useEffect(() => {
		if (!user) {
			setUserSchedules([]);
			setMatchedSchedules([]);
			return;
		}
		fetchUserSchedules();
		fetchMatchedSchedules();
	}, [user]);

	//#region api calls

	async function fetchUserSchedules() {
		return authFetch(`${import.meta.env.VITE_API_URL}/api/schedules/${user!.id}`)
			.then((response) => {
				if (!response.ok) throw new Error("Could not connect to server");

				return response.json();
			})
			.then((data) => {
				const scheduleData = getScheduleFromParsedJson(data);

				if (scheduleData == null) {
					throw new Error("Schedule data invalid");
				}

				setUserSchedules(scheduleData);

				return scheduleData;
			});
	}

	async function fetchMatchedSchedules() {
		//add start and end query params
		// const params = new URLSearchParams({
		// 	start: weekStart.toDateString(),
		// 	end: addWeeks(weekStart, weekDuration).toDateString(),
		// });

		return authFetch(`${import.meta.env.VITE_API_URL}/api/friends/overlap`)
			.then((response) => {
				if (!response.ok) throw new Error("Could not connect to server");

				return response.json();
			})
			.then((data) => {
				const scheduleData = getMatchedSchedulesFromParsedJson(data);

				if (scheduleData == null) throw new Error("Schedule data invalid");

				setMatchedSchedules(scheduleData);

				return scheduleData;
			});
	}

	async function deleteUserSchedule(id: string) {
		return authFetch(`${import.meta.env.VITE_API_URL}/api/schedules`, {
			method: "DELETE",
			body: JSON.stringify({
				id: id,
			}),
		}).then((response) => {
			if (!response.ok) throw new Error("Could not connect to server");
			return fetchUserSchedules();
		});
	}

	async function addUserSchedule(
		userId: string,
		date: string,
		startTime: string,
		endTime: string,
		repeatType: ScheduleRepeatType,
	): Promise<Schedule[]> {
		const scheduleStart = new Date(`${date}T${startTime}`);

		const scheduleEnd = new Date(`${date}T${endTime}`);

		return authFetch(`${import.meta.env.VITE_API_URL}/api/schedules`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId: userId,
				startTime: scheduleStart.toISOString(),
				endTime: scheduleEnd.toISOString(),
				repeatType,
			}),
		}).then((response) => {
			if (!response.ok) throw new Error("Could not connect to server");
			return fetchUserSchedules();
		});
	}
	//#endregion

	function getUserScheduleById(id: string): Schedule | undefined {
		return userSchedules.find((s) => s.id === id);
	}

	return (
		<ScheduleContext.Provider
			value={{
				userSchedules,
				getUserScheduleById,
				matchedSchedules,
				fetchUserSchedules,
				fetchMatchedSchedules,
				deleteUserSchedule,
				addUserSchedule,
			}}
		>
			{children}
		</ScheduleContext.Provider>
	);
};

//#endregion

/* ========================================================================= */
//                        hook
/* ========================================================================= */

//#region hook
export function useSchedule(): ScheduleContextType {
	const context = useContext(ScheduleContext);
	if (!context) {
		throw new Error("useSchedule must be used within a ScheduleProvider");
	}
	return context;
}
//#endregion
