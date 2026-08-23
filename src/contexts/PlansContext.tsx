import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { useAuth } from "./AuthContext";
import { getPlansFromParsedJson, isPresetAvatar, type Plan } from "../utils/types";

/* ========================================================================= */
//                        context
/* ========================================================================= */

//#region context

type PlansContextType = {
	plans: Plan[];
	fetchPlans: () => Promise<Plan[]>;
	getPlanById: (id: string) => Plan | undefined;
	addPlan: (friendId: string, title: string, comments: string, meetTime: Date, location: string) => Promise<Plan[]>;
	cancelPlan: (id: string) => Promise<Plan[]>;
	updatePlanStatus: (id: string, response: "accepted" | "declined") => Promise<Plan[]>;
};

const PlansContext = createContext<PlansContextType | null>(null);

//#endregion

/* ========================================================================= */
//                        provider
/* ========================================================================= */

//#region provider

type PlansProviderProps = {
	children: ReactNode;
};

export const PlansProvider = ({ children }: PlansProviderProps) => {
	// needs to be nested inside AuthProvider
	const { user, authFetch } = useAuth();

	const [plans, setPlans] = useState<Plan[]>([]);

	// fetch plans when user updates
	useEffect(() => {
		if (!user) {
			setPlans([]);
			return;
		}

		fetchPlans();
	}, [user]);

	//#region api calls

	async function fetchPlans(): Promise<Plan[]> {
		const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/plans`);

		if (!response.ok) {
			const data = await response.json();
			throw new Error(data.error);
		}

		const data = await response.json();
		const planData = getPlansFromParsedJson(data);
		if (planData == null) throw new Error("Plan data invalid");

		//make avatarUrls
		for (const p of planData) {
			if (isPresetAvatar(p.friendAvatarUrl)) p.friendAvatarUrl = `/avatars/${p.friendAvatarUrl}.webp`;
		}

		setPlans(planData);

		return planData;
	}

	async function addPlan(friendId: string, title: string, comments: string, meetTime: Date, location: string): Promise<Plan[]> {
		const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/plans`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				friendId,
				title,
				comments,
				meetTime,
				location,
			}),
		});

		if (!response.ok) {
			const data = await response.json();
			throw new Error(data.error);
		}

		return fetchPlans();
	}

	async function cancelPlan(id: string): Promise<Plan[]> {
		const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/plans/${id}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			const data = await response.json();
			throw new Error(data.error);
		}

		return fetchPlans();
	}

	async function updatePlanStatus(id: string, response: "accepted" | "declined"): Promise<Plan[]> {
		const fetchResponse = await authFetch(`${import.meta.env.VITE_API_URL}/api/plans/${id}/respond`, {
			method: "PATCH",
			body: JSON.stringify({
				response,
			}),
		});

		if (!fetchResponse.ok) {
			const data = await fetchResponse.json();
			throw new Error(data.error);
		}

		return fetchPlans();
	}

	//#endregion

	function getPlanById(id: string): Plan | undefined {
		return plans.find((plan) => plan.id === id);
	}

	return (
		<PlansContext.Provider
			value={{
				plans,
				fetchPlans,
				getPlanById,
				addPlan,
				cancelPlan,
				updatePlanStatus,
			}}
		>
			{children}
		</PlansContext.Provider>
	);
};

//#endregion

/* ========================================================================= */
//                        hook
/* ========================================================================= */

//#region hook

export function usePlans(): PlansContextType {
	const context = useContext(PlansContext);

	if (!context) {
		throw new Error("usePlans must be used within a PlansProvider");
	}

	return context;
}

//#endregion
