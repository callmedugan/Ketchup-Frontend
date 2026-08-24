import { format, isBefore } from "date-fns";
import type { Plan } from "../../utils/types";
import { useAuth } from "../../contexts/AuthContext";
import ScrollableContainer from "../common/ScrollableContainer";

type PlanDetailsPaneProps = {
	activePlan: Plan | null;
	error: string | null;
	isSubmitting: boolean;
	confirmAction: boolean;
	setConfirmAction: (value: boolean) => void;
	handleAccept: (plan: Plan) => Promise<void>;
	handleDecline: (plan: Plan) => Promise<void>;
	handleCancel: (plan: Plan) => Promise<void>;
};

export default function PlanDetailsPane({
	activePlan,
	error,
	isSubmitting,
	confirmAction,
	setConfirmAction,
	handleAccept,
	handleDecline,
	handleCancel,
}: PlanDetailsPaneProps) {
	const { user } = useAuth();

	if (!activePlan) {
		return (
			<div className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf8] shadow-sm">
				{showEmptyState()}
			</div>
		);
	}

	//used to avoid having to use plan! everywhere
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
				<p className="text-sm font-bold uppercase tracking-[0.15em] text-[#f1c7bd]">Plan details</p>
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
					<button type="button" onClick={() => setConfirmAction(true)} disabled={isSubmitting} className="btn-secondary">
						Decline
					</button>

					<button type="button" onClick={() => handleAccept(plan)} disabled={isSubmitting} className="btn-primary">
						{isSubmitting ? "Accepting..." : "Accept plan"}
					</button>
				</div>
			);
		}

		if (canCancel) {
			return (
				<div className="flex justify-end">
					<button type="button" onClick={() => setConfirmAction(true)} disabled={isSubmitting} className="btn-danger">
						Cancel plan
					</button>
				</div>
			);
		}

		return null;
	}

	function showConfirmation() {
		if (!confirmAction) return null;

		return (
			<div className="absolute inset-0 z-20 flex items-center justify-center bg-brand-text/20 px-5 backdrop-blur-[1px]">
				<div className="w-full max-w-xs rounded-2xl border border-stone-200 bg-brand-card p-5 shadow-xl">
					<div className="text-center">
						<p className="text-sm font-bold text-brand-text">{canRespond ? "Decline this plan?" : "Cancel this plan?"}</p>

						<p className="mt-1 text-xs font-medium text-brand-muted">This action cannot be undone.</p>
					</div>

					<div className="mt-4 flex gap-2">
						<button
							type="button"
							onClick={() => setConfirmAction(false)}
							disabled={isSubmitting}
							className="flex-1 rounded-xl border border-stone-200 bg-brand-surface px-3 py-2 text-sm font-bold text-brand-text transition hover:bg-[#f3e9df] disabled:opacity-60"
						>
							Go back
						</button>

						<button
							type="button"
							onClick={() => (canRespond ? handleDecline(plan) : handleCancel(plan))}
							disabled={isSubmitting}
							className="flex-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isSubmitting ? (canRespond ? "Declining..." : "Cancelling...") : canRespond ? "Decline" : "Cancel plan"}
						</button>
					</div>
				</div>
			</div>
		);
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

			{showConfirmation()}
		</div>
	);

	function getDetailStatus(plan: Plan, isCreator: boolean, isPast: boolean, lastUpdatedByName: string) {
		switch (plan.status) {
			case "confirmed":
				return {
					text: "Confirmed",
					className: "bg-emerald-100 text-emerald-700",
				};

			case "declined":
				return {
					text: `Declined by ${lastUpdatedByName}`,
					className: "bg-stone-200 text-brand-text",
				};

			case "cancelled":
				return {
					text: `Cancelled by ${lastUpdatedByName}`,
					className: "bg-stone-200 text-brand-text",
				};

			case "pending":
				if (isPast) {
					return {
						text: "Expired",
						className: "bg-stone-200 text-brand-text",
					};
				}

				if (isCreator) {
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
