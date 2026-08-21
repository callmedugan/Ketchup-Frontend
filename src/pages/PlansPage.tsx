import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuth } from "../contexts/AuthContext";
import type { MatchedSchedule } from "../utils/types";
import { useState } from "react";
import NewPlanModal from "../components/plans/newPlansModal";
import { usePlans } from "../contexts/PlansContext";
import { format } from "date-fns";
import PageContainer from "./PageContainer";

export function PlansPage() {
	const location = useLocation();

	// try to get passed state
	const overlap = location.state?.overlap as MatchedSchedule | undefined;
	const [showNewPlanModal, setShowNewPlanModal] = useState(overlap !== undefined);

	// contexts
	const { user } = useAuth();
	const { plans } = usePlans();

	/* ========================================================================= */
	// page
	/* ========================================================================= */

	return (
		<div className="flex h-screen overflow-hidden bg-[#b8794f] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12)_0_1px,transparent_1px),radial-gradient(circle_at_80%_70%,rgba(80,40,20,0.12)_0_1px,transparent_1px)] bg-size[11px_11px,17px_17px]">
			<NavBar />

			<PageContainer>{getContent()}</PageContainer>

			{/* New plan modal */}
			{showNewPlanModal && overlap && showNewPlanModalContent()}
		</div>
	);

	/* ========================================================================= */
	// content
	/* ========================================================================= */

	function getContent() {
		return (
			<div className="flex h-full min-h-0 flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
				{/* Page heading */}
				<div className="mb-7 shrink-0">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Your plans</p>

					{user && <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">Hello, {user.name.split(" ")[0]}!</h1>}

					<p className="mt-1 text-sm text-stone-500">Keep track of what's going down.</p>
				</div>

				{/* Plans container */}
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#faf7f0] shadow-sm">
					{/* Scrollable plans list */}
					<div
						className="
							min-h-0 flex-1 overflow-y-auto p-3 sm:p-5
							scrollbar-none
							[&::-webkit-scrollbar]:hidden
						"
					>
						<div className="flex flex-col gap-3">
							{plans.map((plan) => (
								<div
									key={plan.id}
									className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
								>
									<div className="min-w-0">
										<div className="flex items-center gap-2">
											<h2 className="truncate font-bold text-stone-800">{plan.title}</h2>

											<span
												className={`rounded-full px-2 py-0.5 text-xs font-bold ${
													plan.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
												}`}
											>
												{plan.status}
											</span>
										</div>

										<p className="mt-1 text-sm font-medium text-stone-600">With {plan.friendName}</p>

										<p className="mt-1 text-sm text-stone-500">{format(plan.meetTime, "EEEE, MMMM d p")}</p>
									</div>

									<button
										type="button"
										className="shrink-0 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 transition hover:bg-stone-50 active:scale-95"
									>
										Details
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	/* ========================================================================= */
	// new plan modal
	/* ========================================================================= */

	function showNewPlanModalContent() {
		if (!overlap) return null;

		return <NewPlanModal overlap={overlap} friendName={overlap.friendName} onClose={() => setShowNewPlanModal(false)} />;
	}
}
