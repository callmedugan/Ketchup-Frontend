import { format, isBefore } from "date-fns";
import ScrollableContainer from "../common/ScrollableContainer";
import { usePlans } from "../../contexts/PlansContext";
import { useAuth } from "../../contexts/AuthContext";
import type { Plan } from "../../utils/types";
import PlanInfoModal from "./PlanInfoModal";
import { useState } from "react";

export default function PlansList() {
	const { plans } = usePlans();
	const { user } = useAuth();

	const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
	const [showActiveOnly, setShowActiveOnly] = useState(true);

	const now = new Date();

	const visiblePlans = plans.filter((plan) => {
		const isCreator = plan.creatorId === user?.id;
		const isPast = isBefore(plan.meetTime, now);

		// Declined plans only appear for the person who created the invite
		if (plan.status === "declined" && !isCreator) {
			return false;
		}

		// Active view only shows upcoming pending / confirmed plans
		if (showActiveOnly) {
			return !isPast && (plan.status === "pending" || plan.status === "confirmed");
		}

		return true;
	});

	return (
		<>
			{/* Plans container */}
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#faf7f0] shadow-sm">
				{/* Filter */}
				<div className="flex shrink-0 items-center justify-end border-b border-stone-200 px-3 py-2 sm:px-5">
					<div className="flex items-center gap-2">
						<span className="text-xs font-bold text-stone-500">{showActiveOnly ? "Active only" : "Showing all"}</span>

						<button
							type="button"
							role="switch"
							aria-checked={showActiveOnly}
							aria-label="Show active plans only"
							onClick={() => setShowActiveOnly((prev) => !prev)}
							className={`relative h-6 w-11 rounded-full transition-colors ${showActiveOnly ? "bg-[#943b32]" : "bg-stone-300"}`}
						>
							<span
								className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all ${
									showActiveOnly ? "right-0.5" : "left-0.5"
								}`}
							/>
						</button>
					</div>
				</div>

				{/* Content */}
				<ScrollableContainer className="p-3 sm:p-5">
					<div className="flex flex-col gap-3">
						{visiblePlans.map((plan) => {
							const isPast = isBefore(plan.meetTime, now);

							const isInactive = isPast || plan.status === "declined" || plan.status === "cancelled";

							const lastUpdatedByName = plan.lastUpdatedBy === user?.id ? "You" : plan.friendName;

							const status = getPlanStatus(plan, lastUpdatedByName);

							return (
								<button
									key={plan.id}
									type="button"
									onClick={() => setSelectedPlan(plan)}
									className={`
										group flex w-full items-center justify-between
										rounded-xl border p-4 text-left shadow-sm transition
										active:translate-y-0 active:shadow-sm
										${
											isInactive
												? "border-stone-200 bg-stone-100/80 opacity-60 hover:border-stone-300 hover:opacity-75"
												: "border-stone-200 bg-[#fffdf9] hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
										}
									`}
								>
									<div className="min-w-0">
										<div className="flex items-center gap-2">
											<h2 className={`truncate text-lg font-bold ${isInactive ? "text-stone-500" : "text-stone-800"}`}>{plan.title}</h2>

											<span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${status.className}`}>{status.text}</span>
										</div>

										<p className={`mt-1 text-sm font-medium ${isInactive ? "text-stone-400" : "text-stone-600"}`}>With {plan.friendName}</p>

										<p className={`mt-0.5 text-sm ${isInactive ? "text-stone-400" : "text-stone-500"}`}>
											{format(plan.meetTime, "EEE, MMM d ' @ ' h:mm a")}
											{isPast && " · Past"}
										</p>
									</div>

									{/* Click indicator */}
									<svg
										viewBox="0 0 20 20"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="
											ml-4 h-5 w-5 shrink-0 text-stone-300
											transition
											group-hover:translate-x-0.5
											group-hover:text-stone-500
										"
									>
										<path d="M7 4l6 6-6 6" />
									</svg>
								</button>
							);
						})}

						{/* Empty state */}
						{visiblePlans.length === 0 && (
							<div className="rounded-xl border border-dashed border-stone-300 bg-[#fffdf9] px-6 py-12 text-center">
								<h3 className="font-bold text-stone-800">{showActiveOnly ? "No active plans" : "No plans yet"}</h3>

								<p className="mx-auto mt-1 max-w-sm text-sm text-stone-500">
									{showActiveOnly ? "You don't have any upcoming plans right now." : "Make some plans with a friend to get started!"}
								</p>
							</div>
						)}
					</div>
				</ScrollableContainer>

				{/* Plan info modal */}
				{selectedPlan && <PlanInfoModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />}
			</div>
		</>
	);

	function getPlanStatus(plan: Plan, lastUpdatedByName: string) {
		switch (plan.status) {
			case "confirmed":
				return {
					text: "Confirmed",
					className: "bg-emerald-100 text-emerald-700",
				};

			case "declined":
				return {
					text: `Declined by ${lastUpdatedByName}`,
					className: "bg-stone-200 text-stone-600",
				};

			case "cancelled":
				return {
					text: `Cancelled by ${lastUpdatedByName}`,
					className: "bg-stone-200 text-stone-600",
				};

			case "pending":
				if (plan.creatorId === user?.id) {
					return {
						text: "Invite sent",
						className: "bg-amber-100 text-amber-700",
					};
				}

				return {
					text: "Awaiting response",
					className: "bg-blue-100 text-blue-700",
				};
		}
	}
}
