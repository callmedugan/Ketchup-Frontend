/* ========================================================================= */
//                        schedules
/* ========================================================================= */

export type ScheduleRepeatType = "once" | "daily" | "weekly";
export type Schedule = {
	id: string;
	repeatType: ScheduleRepeatType;
	startTime: Date;
	endTime: Date;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
};

function isValidRepeatType(obj: any): obj is ScheduleRepeatType {
	if (!obj || typeof obj !== "string") return false;

	if (obj === "once" || obj === "daily" || obj === "weekly") return true;

	return false;
}

function isScheduleArray(obj: any): obj is Schedule[] {
	if (Array.isArray(obj)) {
		for (const item of obj) {
			if (!isSchedule(item)) return false;
		}
		return true;
	}
	return false;
}

//only use internally, does not convert dates from the json string
function isSchedule(obj: any): obj is Schedule {
	return (
		obj !== null &&
		typeof obj === "object" &&
		//strings
		typeof obj?.id === "string" &&
		typeof obj?.userId === "string" &&
		//dates
		typeof obj?.startTime === "string" &&
		!isNaN(Date.parse(obj?.startTime)) &&
		typeof obj?.endTime === "string" &&
		!isNaN(Date.parse(obj?.endTime)) &&
		typeof obj?.createdAt === "string" &&
		!isNaN(Date.parse(obj?.createdAt)) &&
		typeof obj?.updatedAt === "string" &&
		!isNaN(Date.parse(obj?.updatedAt)) &&
		//reapeat
		isValidRepeatType(obj?.repeatType)
	);
}

//returns array with schedule objs or obj
export const getScheduleFromParsedJson = (parsedData: string): Schedule[] | undefined => {
	try {
		if (isScheduleArray(parsedData)) {
			const result = [];
			for (const p of parsedData) result.push(setDates(p));
			return result;
		}
		if (isSchedule(parsedData)) {
			return [setDates(parsedData)];
		}
		return undefined;
	} catch (e) {
		console.error("Invalid data.");
	}
};

//used to build the dates. technically not safe but date was parsed when checking if schedule
function setDates(s: Schedule): Schedule {
	return {
		...s,
		startTime: new Date(s.startTime),
		endTime: new Date(s.endTime),
		createdAt: new Date(s.createdAt),
		updatedAt: new Date(s.updatedAt),
	};
}

/* ========================================================================= */
//                        User
/* ========================================================================= */

export type User = {
	id: string;
	name: string;
	email: string;
};

function isUser(obj: any): obj is User {
	return (
		obj !== null &&
		typeof obj === "object" &&
		typeof obj?.id === "string" &&
		typeof obj?.name === "string" &&
		typeof obj?.email === "string"
	);
}

export const getUserFromParsedJson = (parsedData: string): User | undefined => {
	try {
		if (isUser(parsedData)) return parsedData;
		else return undefined;
	} catch (e) {
		console.error("Invalid data.");
	}
};
