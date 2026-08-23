import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { MatchedSchedule } from "../utils/types";
import { useState } from "react";
import NewPlanModal from "../components/plans/NewPlansModal";
import PageContainer from "./PageContainer";
import PlansSplitView from "../components/plans/PlansSplitView";

export function PlansPage() {
	const location = useLocation();

	// try to get passed state
	const overlap = location.state?.overlap as MatchedSchedule | undefined;
	const [showNewPlanModal, setShowNewPlanModal] = useState(overlap !== undefined);

	// contexts
	const { user } = useAuth();

	/* ========================================================================= */
	// page
	/* ========================================================================= */

	return (
		<PageContainer>
			{getContent()}
			{/* New plan modal */}
			{showNewPlanModal && overlap && showNewPlanModalContent()}
		</PageContainer>
	);

	/* ========================================================================= */
	// content
	/* ========================================================================= */

	function getContent() {
		return (
			<div className="flex h-full min-h-0 flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
				{/* Page heading */}
				<div className="mb-7 shrink-0">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">Your plans</p>

					{user && <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-text">Hello, {user.name.split(" ")[0]}!</h1>}

					<p className="mt-1 text-sm font-medium text-brand-muted">Keep track of what's going down.</p>
				</div>

				<PlansSplitView />
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
