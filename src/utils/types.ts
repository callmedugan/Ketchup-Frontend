import { z } from "zod";

/* ========================================================================= */
//                        shared helpers
/* ========================================================================= */

function parseOneOrMany<T>(schema: z.ZodType<T>, data: unknown): T[] | undefined {
	const arrayResult = z.array(schema).safeParse(data);

	if (arrayResult.success) {
		return arrayResult.data;
	}

	const singleResult = schema.safeParse(data);

	if (singleResult.success) {
		return [singleResult.data];
	}

	return undefined;
}

/* ========================================================================= */
//                        schedules
/* ========================================================================= */

//#region schedules

export const scheduleSchema = z.object({
	id: z.string(),
	userId: z.string(),

	repeatType: z.enum(["once", "daily", "weekly"]),

	startTime: z.coerce.date(),
	endTime: z.coerce.date(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type Schedule = z.infer<typeof scheduleSchema>;
export type ScheduleRepeatType = Schedule["repeatType"];

export function getScheduleFromParsedJson(data: unknown): Schedule[] | undefined {
	return parseOneOrMany(scheduleSchema, data);
}

//#endregion

/* ========================================================================= */
//                        friends
/* ========================================================================= */

//#region friends

export const friendSchema = z.object({
	userId: z.string(),
	name: z.string(),

	updatedAt: z.coerce.date(),

	status: z.enum(["requested", "accepted", "blocked"]),
	bio: z.string(),
	timezone: z.string(),
	avatarUrl: z.string(),
});

export type Friend = z.infer<typeof friendSchema>;
export type FriendStatusType = Friend["status"];

export function getFriendsFromParsedJson(data: unknown): Friend[] | undefined {
	return parseOneOrMany(friendSchema, data);
}

//#endregion

/* ========================================================================= */
//                        matched schedules
/* ========================================================================= */

//#region matched schedules

//backend
export const matchedScheduleDataSchema = scheduleSchema.extend({
	userScheduleIdMatched: z.string(),
});

export type MatchedScheduleData = z.infer<typeof matchedScheduleDataSchema>;
export function getMatchedSchedulesFromParsedJson(data: unknown): MatchedScheduleData[] | undefined {
	return parseOneOrMany(matchedScheduleDataSchema, data);
}

//frontend
export const matchedScheduleSchema = matchedScheduleDataSchema.extend({
	friendName: z.string(),
	friendAvatarUrl: z.string(),
});
export type MatchedSchedule = z.infer<typeof matchedScheduleSchema>;

//#endregion

/* ========================================================================= */
//                        user
/* ========================================================================= */

//#region user

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	bio: z.string(),
	timezone: z.string(),
	avatarUrl: z.string(),
});

export type User = z.infer<typeof userSchema>;

export function getUserFromParsedJson(data: unknown): User | undefined {
	const result = userSchema.safeParse(data);

	if (!result.success) {
		return undefined;
	}

	return result.data;
}

//#endregion

/* ========================================================================= */
//                        user search result
/* ========================================================================= */

//#region userSearchResult

export const userSearchResultSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export type UserSearchResult = z.infer<typeof userSearchResultSchema>;

export function getUserSearchResultsFromParsedJson(data: unknown): UserSearchResult[] | undefined {
	return parseOneOrMany(userSearchResultSchema, data);
}

//#endregion

/* ========================================================================= */
//                        plans
/* ========================================================================= */

export const planDataSchema = z.object({
	id: z.string(),
	creatorId: z.string(),
	friendId: z.string(),
	status: z.enum(["declined", "pending", "confirmed", "cancelled"]),
	title: z.string(),
	comments: z.string(),
	meetTime: z.coerce.date(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	lastUpdatedBy: z.string(),
	location: z.string(),
});

export type PlanData = z.infer<typeof planDataSchema>;
export type PlanStatus = PlanData["status"];

export function getPlansFromParsedJson(data: unknown): PlanData[] | undefined {
	return parseOneOrMany(planDataSchema, data);
}

//frontend
export const planSchema = planDataSchema.extend({
	friendName: z.string(),
	friendAvatarUrl: z.string(),
});
export type Plan = z.infer<typeof planSchema>;

/* ========================================================================= */
//                        avatars
/* ========================================================================= */
export const presetAvatarStrings = [
	"ketchup",
	"mustard",
	"mayo",
	"sriracha",
	"ranch",
	"bbq",
	"honey",
	"soy",
	"relish",
	"hot-sauce",
	"whole-grain-mustard",
	"aioli",
] as const;
export type presetAvatarType = (typeof presetAvatarStrings)[number];
export function isPresetAvatar(value: string): value is presetAvatarType {
	return presetAvatarStrings.includes(value as presetAvatarType);
}
