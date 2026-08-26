import { format, isBefore } from "date-fns";
import type { Plan } from "../../utils/types";
import { useAuth } from "../../contexts/AuthContext";
import ScrollableContainer from "../common/ScrollableContainer";
import HoldButton from "../common/HoldButton";

type PlanDetailsPaneProps = {
	activePlan: Plan | null;
	error: string | null;
	isSubmitting: boolean;
	handleAccept: (plan: Plan) => Promise<void>;
	handleDecline: (plan: Plan) => Promise<void>;
	handleCancel: (plan: Plan) => Promise<void>;
};

export default function PlanDetailsPane({ activePlan, error, isSubmitting, handleAccept, handleDecline, handleCancel }: PlanDetailsPaneProps) {
	const { user } = useAuth();

	if (!activePlan) {
		return <div className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf8] shadow-sm">{showEmptyState()}</div>;
	}

	// used to avoid having to use plan! everywhere
	const plan = activePlan;

	const isCreator = plan.creatorId === user?.id;
	const isPending = plan.status === "pending";
	const isPast = isBefore(plan.meetTime, new Date());

	const canRespond = isPending && !isCreator && !isPast;
	const canCancel = !isPast && (plan.status === "pending" || plan.status === "confirmed");
	const lastUpdatedByName = plan.lastUpdatedBy === user?.id ? "You" : plan.friendName;

	const status = getDetailStatus(plan, isCreator, isPast, lastUpdatedByName);

	function showHeader() {
		return (
			<div className="shrink-0 border-b border-brand-red-dark bg-brand-red px-6 py-3">
				<p className="text-sm font-bold uppercase tracking-wide text-brand-cream">Plan details</p>
			</div>
		);
	}

	function showDetails() {
		return (
			<section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
				<div className="space-y-4 p-5">
					{showWhen()}
					{showWith()}
					{showWhere()}
					{showWhat()}
					{showStatus()}
				</div>
			</section>
		);
	}

	function showWhen() {
		return (
			<div className="flex items-start gap-5">
				<p className="plan-label">When</p>

				<p className="text-sm font-bold text-brand-text">{format(plan.meetTime, "EEEE, MMMM d 'at' h:mm a")}</p>
			</div>
		);
	}

	function showWith() {
		return (
			<div className="flex items-start gap-5">
				<p className="plan-label">With</p>

				<p className="text-sm font-bold text-brand-text">{plan.friendName}</p>
			</div>
		);
	}

	function showWhere() {
		if (!plan.location) return null;

		return (
			<div className="flex items-start gap-5">
				<p className="plan-label">Where</p>

				<p className="text-sm font-bold text-brand-text">{plan.location}</p>
			</div>
		);
	}

	function showWhat() {
		return (
			<div className="flex items-start gap-5">
				<p className="plan-label">What</p>

				<div className="min-w-0">
					<p className="text-sm font-bold text-brand-text">{plan.title}</p>

					{plan.comments && <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-brand-muted">{plan.comments}</p>}
				</div>
			</div>
		);
	}

	function showStatus() {
		return (
			<div className="flex items-start gap-3">
				<p className="plan-label mt-1.5">status</p>

				<span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}>{status.text}</span>
			</div>
		);
	}

	function showError() {
		if (!error) return null;

		return <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>;
	}

	function showActions() {
		if (canRespond) {
			return (
				<div className="flex justify-end gap-3">
					<HoldButton variant="secondary" onComplete={() => handleDecline(plan)} disabled={isSubmitting}>
						Decline
					</HoldButton>

					<button type="button" onClick={() => handleAccept(plan)} disabled={isSubmitting} className="btn-primary">
						{isSubmitting ? "Accepting..." : "Accept plan"}
					</button>
				</div>
			);
		}

		if (canCancel) {
			return (
				<div className="flex justify-end">
					<HoldButton variant="danger" onComplete={() => handleCancel(plan)} disabled={isSubmitting}>
						Cancel
					</HoldButton>
				</div>
			);
		}

		return null;
	}

	return (
		<div className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf8] shadow-sm">
			{showHeader()}

			<ScrollableContainer className="p-5 sm:p-6">
				<div className="mx-auto max-w-2xl space-y-5">
					{showDetails()}
					{showError()}
					{showActions()}
				</div>
			</ScrollableContainer>
		</div>
	);

	function getDetailStatus(plan: Plan, isCreator: boolean, isPast: boolean, lastUpdatedByName: string) {
		switch (plan.status) {
			case "confirmed":
				return { text: "Confirmed", className: "bg-emerald-100 text-emerald-700" };

			case "declined":
				return { text: `Declined by ${lastUpdatedByName}`, className: "bg-stone-200 text-brand-text" };

			case "cancelled":
				return { text: `Cancelled by ${lastUpdatedByName}`, className: "bg-stone-200 text-brand-text" };

			case "pending":
				if (isPast) {
					return { text: "Expired", className: "bg-stone-200 text-brand-text" };
				}

				if (isCreator) {
					return { text: "Invite sent", className: "bg-amber-100 text-amber-700" };
				}

				return { text: "Awaiting response", className: "bg-blue-100 text-blue-700" };
		}
	}
}

function showEmptyState() {
	return (
		<div className="flex h-full min-h-100 items-center justify-center p-8">
			<div className="max-w-sm text-center">
				<h2 className="mt-4 text-lg font-bold text-brand-text">Select a plan</h2>

				<p className="mt-1 text-sm font-medium text-brand-muted">Choose a plan from the list to see details, status, and available actions.</p>
			</div>
		</div>
	);
}
