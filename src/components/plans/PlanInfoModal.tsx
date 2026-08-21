import { useState } from "react";
import { format, isBefore } from "date-fns";
import type { Plan } from "../../utils/types";
import { usePlans } from "../../contexts/PlansContext";
import { useAuth } from "../../contexts/AuthContext";

type PlanInfoModalProps = {
	plan: Plan;
	onClose: () => void;
};

export default function PlanInfoModal({ plan, onClose }: PlanInfoModalProps) {
	const { user } = useAuth();
	const { updatePlanStatus, cancelPlan } = usePlans();

	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [confirmAction, setConfirmAction] = useState(false);

	const isCreator = plan.creatorId === user?.id;
	const isPending = plan.status === "pending";
	const isPast = isBefore(plan.meetTime, new Date());

	const canRespond = isPending && !isCreator && !isPast;

	const canCancel = !isPast && (plan.status === "pending" || plan.status === "confirmed");

	const lastUpdatedByName = plan.lastUpdatedBy === user?.id ? "You" : plan.friendName;

	const status = getStatus();

	async function handleAccept() {
		setError(null);
		setIsSubmitting(true);

		try {
			await updatePlanStatus(plan.id, "accepted");
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong while accepting the plan.");
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleDecline() {
		setError(null);
		setIsSubmitting(true);

		try {
			await updatePlanStatus(plan.id, "declined");
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong while declining the plan.");
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleCancel() {
		setError(null);
		setIsSubmitting(true);

		try {
			await cancelPlan(plan.id);
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong while cancelling the plan.");
		} finally {
			setIsSubmitting(false);
		}
	}

	function getStatus() {
		switch (plan.status) {
			case "confirmed":
				return {
					text: "Confirmed",
					title: isPast ? "This plan has passed" : "You're all set!",
					className: "bg-emerald-100 text-emerald-700",
				};

			case "declined":
				return {
					text: `Declined by ${lastUpdatedByName}`,
					title: "This invite was declined",
					className: "bg-stone-200 text-brand-text",
				};

			case "cancelled":
				return {
					text: `Cancelled by ${lastUpdatedByName}`,
					title: "This plan was cancelled",
					className: "bg-stone-200 text-brand-text",
				};

			case "pending":
				if (isPast) {
					return {
						text: "Expired",
						title: "This invite has passed",
						className: "bg-stone-200 text-brand-text",
					};
				}

				if (isCreator) {
					return {
						text: "Invite sent",
						title: "Waiting for a response",
						className: "bg-amber-100 text-amber-700",
					};
				}

				return {
					text: "Awaiting response",
					title: "You've been invited",
					className: "bg-blue-100 text-blue-700",
				};
		}
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 px-4 backdrop-blur-[2px]"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}
		>
			<div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf8] shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-[#7f2f29] bg-[#943b32] px-5 py-4">
					<h2 className="truncate text-xl font-bold text-[#fff3d6]">Plan Details</h2>

					<button
						type="button"
						onClick={onClose}
						className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl text-[#f7ddd4] transition hover:bg-white/10 hover:text-white"
						aria-label="Close"
					>
						×
					</button>
				</div>

				<div className="space-y-5 p-5">
					{/* Plan details */}
					<section>
						<div className="rounded-xl border border-stone-200 bg-white p-4">
							<div className="space-y-2.5">
								{/* When */}
								<div className="flex items-baseline gap-4">
									<p className="w-14 shrink-0 text-xs font-semibold uppercase tracking-wide text-brand-muted">When</p>

									<p className="text-sm font-bold text-brand-text">{format(plan.meetTime, "EEE, MMM d ' @ ' h:mm a")}</p>
								</div>

								{/* With */}
								<div className="flex items-baseline gap-4">
									<p className="w-14 shrink-0 text-xs font-semibold uppercase tracking-wide text-brand-muted">With</p>

									<p className="text-sm font-bold text-brand-text">{plan.friendName}</p>
								</div>

								{/* Where */}
								{plan.location && (
									<div className="flex items-baseline gap-4">
										<p className="w-14 shrink-0 text-xs font-semibold uppercase tracking-wide text-brand-muted">Where</p>

										<p className="text-sm font-bold text-brand-text">{plan.location}</p>
									</div>
								)}

								{/* What */}
								<div className="flex items-baseline gap-4">
									<p className="w-14 shrink-0 text-xs font-semibold uppercase tracking-wide text-brand-muted">What</p>

									<div className="min-w-0">
										<p className="text-sm font-bold text-brand-text">{plan.title}</p>

										{plan.comments && <p className="mt-0.5 whitespace-pre-wrap text-sm text-brand-muted">{plan.comments}</p>}
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Status */}
					<section>
						<div className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-4">
							<p className="text-sm font-bold text-brand-text">{status.title}</p>

							<span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${status.className}`}>{status.text}</span>
						</div>
					</section>

					{/* Error */}
					{error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

					{/* Respond */}
					{canRespond && (
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => setConfirmAction(true)}
								disabled={isSubmitting}
								className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-bold text-brand-text transition hover:bg-[#faf7f0] disabled:cursor-not-allowed disabled:opacity-60"
							>
								Decline
							</button>

							<button
								type="button"
								onClick={handleAccept}
								disabled={isSubmitting}
								className="flex-1 rounded-xl bg-[#943b32] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f2f29] disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isSubmitting ? "Accepting..." : "Accept plan"}
							</button>
						</div>
					)}

					{/* Active plan actions */}
					{!canRespond && canCancel && (
						<div className="flex justify-between gap-2">
							<button
								type="button"
								onClick={() => setConfirmAction(true)}
								disabled={isSubmitting}
								className="rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
							>
								Cancel plan
							</button>

							<button
								type="button"
								onClick={onClose}
								className="rounded-xl px-4 py-2.5 text-sm font-bold text-brand-text transition hover:bg-[#faf7f0]"
							>
								Close
							</button>
						</div>
					)}

					{/* Inactive / past */}
					{!canRespond && !canCancel && (
						<div className="flex justify-end">
							<button
								type="button"
								onClick={onClose}
								className="rounded-xl px-4 py-2.5 text-sm font-bold text-brand-text transition hover:bg-[#faf7f0]"
							>
								Close
							</button>
						</div>
					)}
				</div>

				{/* Confirmation overlay */}
				{confirmAction && (
					<div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-950/20 px-5 backdrop-blur-[1px]">
						<div className="w-full max-w-xs rounded-xl border border-stone-200 bg-[#fffdf8] p-4 shadow-xl">
							<p className="text-center text-sm font-bold text-brand-text">{canRespond ? "Decline this plan?" : "Cancel this plan?"}</p>

							<p className="mt-1 text-center text-xs font-medium text-brand-muted">This action cannot be undone.</p>

							<div className="mt-4 flex gap-2">
								<button
									type="button"
									onClick={() => setConfirmAction(false)}
									disabled={isSubmitting}
									className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-bold text-brand-text transition hover:bg-[#faf7f0] disabled:opacity-60"
								>
									Go back
								</button>

								<button
									type="button"
									onClick={canRespond ? handleDecline : handleCancel}
									disabled={isSubmitting}
									className="flex-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{isSubmitting ? (canRespond ? "Declining..." : "Cancelling...") : canRespond ? "Decline" : "Cancel plan"}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
