import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { useAuth } from "./AuthContext";
import type { Plan } from "../utils/types";

/* ========================================================================= */
//                        context
/* ========================================================================= */

//#region context

type PlansContextType = {
	plans: Plan[];
	fetchPlans: () => Promise<Plan[]>;
	getPlanById: (id: string) => Plan | undefined;
	addPlan: (friendId: string, title: string, comments: string, meetTime: Date) => Promise<Plan[]>;
	deletePlan: (id: string) => Promise<Plan[]>;
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

		// temporary until you make getPlansFromParsedJson()
		const planData = data as Plan[];

		setPlans(planData);

		return planData;
	}

	async function addPlan(friendId: string, title: string, comments: string, meetTime: Date): Promise<Plan[]> {
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
			}),
		});

		if (!response.ok) {
			const data = await response.json();
			throw new Error(data.error);
		}

		return fetchPlans();
	}

	async function deletePlan(id: string): Promise<Plan[]> {
		const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/plans`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id,
			}),
		});

		if (!response.ok) {
			const data = await response.json();
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
				deletePlan,
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
