import { useState } from "react";
import type { Plan } from "../../utils/types";
import { usePlans } from "../../contexts/PlansContext";
import PlanDetailsPane from "./PlanDetailsPane";
import PlansListPane from "./PlansListPane";

export default function PlansSplitView() {
	const { plans, updatePlanStatus, cancelPlan } = usePlans();

	const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [confirmAction, setConfirmAction] = useState(false);

	const activePlan = selectedPlan ? (plans.find((plan) => plan.id === selectedPlan.id) ?? selectedPlan) : null;

	//#region handlers
	function handleSelectPlan(plan: Plan) {
		setSelectedPlan(plan);
		setError(null);
		setConfirmAction(false);
	}

	async function handleAccept(plan: Plan) {
		setError(null);
		setIsSubmitting(true);

		try {
			await updatePlanStatus(plan.id, "accepted");
			setConfirmAction(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong while accepting the plan.");
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleDecline(plan: Plan) {
		setError(null);
		setIsSubmitting(true);

		try {
			await updatePlanStatus(plan.id, "declined");
			setConfirmAction(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong while declining the plan.");
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleCancel(plan: Plan) {
		setError(null);
		setIsSubmitting(true);

		try {
			await cancelPlan(plan.id);
			setConfirmAction(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong while cancelling the plan.");
		} finally {
			setIsSubmitting(false);
		}
	}
	//#endregion

	return (
		<div className="grid min-h-0 flex-1 grid-cols-[minmax(300px,0.85fr)_minmax(0,1.35fr)] gap-4">
			<PlansListPane activePlan={activePlan} onSelectPlan={handleSelectPlan} onClearError={() => setError(null)} />

			<PlanDetailsPane
				activePlan={activePlan}
				error={error}
				isSubmitting={isSubmitting}
				confirmAction={confirmAction}
				setConfirmAction={setConfirmAction}
				handleAccept={handleAccept}
				handleDecline={handleDecline}
				handleCancel={handleCancel}
			/>
		</div>
	);
}
