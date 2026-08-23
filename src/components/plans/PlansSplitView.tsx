import { useState } from "react";
import { format, isBefore } from "date-fns";
import { usePlans } from "../../contexts/PlansContext";
import { useAuth } from "../../contexts/AuthContext";
import type { Plan } from "../../utils/types";
import ScrollableContainer from "../common/ScrollableContainer";

export default function PlansSplitView() {
	const { plans, updatePlanStatus, cancelPlan } = usePlans();
	const { user } = useAuth();

	const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
	const [showActiveOnly, setShowActiveOnly] = useState(true);

	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [confirmAction, setConfirmAction] = useState(false);

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

	const activePlan = selectedPlan ? (plans.find((plan) => plan.id === selectedPlan.id) ?? selectedPlan) : null;

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

	return (
		<div className="grid min-h-0 flex-1 grid-cols-[minmax(300px,0.85fr)_minmax(0,1.35fr)] gap-4">
			{/* ================================================================ */}
			{/* Left side - plans list */}
			{/* ================================================================ */}
			<div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#faf7f0] shadow-sm">
				{/* Filter tabs */}
				<div className="grid shrink-0 grid-cols-2 border-b border-stone-200 bg-[#fffdf9]">
					<button
						type="button"
						onClick={() => {
							setShowActiveOnly(true);
							setError(null);
						}}
						className={`
							border-r border-stone-200 px-4 py-3
							text-sm font-bold transition
							${showActiveOnly ? "bg-[#943b32] text-[#fff3d6]" : "text-brand-muted hover:bg-[#f3e9df] hover:text-brand-text"}
						`}
					>
						Active
					</button>

					<button
						type="button"
						onClick={() => {
							setShowActiveOnly(false);
							setError(null);
						}}
						className={`
							px-4 py-3
							text-sm font-bold transition
							${!showActiveOnly ? "bg-[#943b32] text-[#fff3d6]" : "text-brand-muted hover:bg-[#f3e9df] hover:text-brand-text"}
						`}
					>
						All
					</button>
				</div>

				{/* Plans */}
				<ScrollableContainer className="p-3 sm:p-4">
					<div className="flex flex-col gap-2.5">
						{visiblePlans.map((plan) => {
							const isPast = isBefore(plan.meetTime, now);

							const isInactive = isPast || plan.status === "declined" || plan.status === "cancelled";

							const isSelected = activePlan?.id === plan.id;

							const lastUpdatedByName = plan.lastUpdatedBy === user?.id ? "You" : plan.friendName;

							const status = getPlanStatus(plan, lastUpdatedByName);

							return (
								<button
									key={plan.id}
									type="button"
									onClick={() => {
										setSelectedPlan(plan);
										setError(null);
										setConfirmAction(false);
									}}
									className={`
										group flex w-full items-center justify-between
										rounded-xl border p-3.5 text-left transition
										${
											isSelected
												? "border-[#c77b70] bg-[#fff7f2] shadow-sm ring-1 ring-[#943b32]/10"
												: isInactive
													? "border-stone-200 bg-stone-100/80 opacity-60 hover:border-stone-300 hover:opacity-75"
													: "border-stone-200 bg-[#fffdf9] hover:border-stone-300 hover:shadow-sm"
										}
									`}
								>
									{/* Friend + plan info */}
									<div className="flex min-w-0 items-center gap-3">
										{/* Friend avatar */}
										<img
											src={plan.friendAvatarUrl}
											alt={`${plan.friendName}'s avatar`}
											className={`
												h-11 w-11 shrink-0 rounded-full object-cover
												${isInactive ? "opacity-70" : ""}
											`}
										/>

										{/* Plan info */}
										<div className="min-w-0">
											<div className="flex items-center gap-2">
												<h3 className={`truncate font-bold ${isInactive ? "text-brand-muted" : "text-brand-text"}`}>{plan.title}</h3>

												<span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${status.className}`}>{status.text}</span>
											</div>

											<p className={`mt-0.5 text-xs font-medium ${isInactive ? "text-brand-muted/70" : "text-brand-muted"}`}>
												{format(plan.meetTime, "EEE, MMM d ' @ ' h:mm a")}

												{isPast && " · Past"}
											</p>
										</div>
									</div>

									{/* Arrow */}
									<svg
										viewBox="0 0 20 20"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className={`
											ml-3 h-5 w-5 shrink-0 transition
											${isSelected ? "translate-x-0.5 text-[#943b32]" : "text-brand-muted/40 group-hover:translate-x-0.5 group-hover:text-brand-muted"}
										`}
									>
										<path d="M7 4l6 6-6 6" />
									</svg>
								</button>
							);
						})}

						{/* Empty state */}
						{visiblePlans.length === 0 && (
							<div className="rounded-xl border border-dashed border-stone-300 bg-[#fffdf9] px-5 py-10 text-center">
								<h3 className="font-bold text-brand-text">{showActiveOnly ? "No active plans" : "No plans yet"}</h3>

								<p className="mx-auto mt-1 max-w-sm text-sm font-medium text-brand-muted">
									{showActiveOnly ? "You don't have any upcoming plans right now." : "Make some plans with a friend to get started!"}
								</p>
							</div>
						)}
					</div>
				</ScrollableContainer>
			</div>
			{/* ================================================================ */}
			{/* Right side - plan details */}
			{/* ================================================================ */}
			<div className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf8] shadow-sm">
				{activePlan ? (
					<PlanDetails
						plan={activePlan}
						error={error}
						isSubmitting={isSubmitting}
						confirmAction={confirmAction}
						setConfirmAction={setConfirmAction}
						handleAccept={handleAccept}
						handleDecline={handleDecline}
						handleCancel={handleCancel}
					/>
				) : (
					<div className="flex h-full min-h-100 items-center justify-center p-8">
						<div className="max-w-sm text-center">
							<h2 className="mt-4 text-lg font-bold text-brand-text">Select a plan</h2>

							<p className="mt-1 text-sm font-medium text-brand-muted">Choose a plan from the list to see details, status, and available actions.</p>
						</div>
					</div>
				)}
			</div>
		</div>
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
					className: "bg-stone-200 text-brand-text",
				};

			case "cancelled":
				return {
					text: `Cancelled by ${lastUpdatedByName}`,
					className: "bg-stone-200 text-brand-text",
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

	type PlanDetailsProps = {
		plan: Plan;
		error: string | null;
		isSubmitting: boolean;
		confirmAction: boolean;
		setConfirmAction: (value: boolean) => void;
		handleAccept: (plan: Plan) => Promise<void>;
		handleDecline: (plan: Plan) => Promise<void>;
		handleCancel: (plan: Plan) => Promise<void>;
	};

	function PlanDetails({ plan, error, isSubmitting, confirmAction, setConfirmAction, handleAccept, handleDecline, handleCancel }: PlanDetailsProps) {
		const isCreator = plan.creatorId === user?.id;
		const isPending = plan.status === "pending";
		const isPast = isBefore(plan.meetTime, new Date());

		const canRespond = isPending && !isCreator && !isPast;

		const canCancel = !isPast && (plan.status === "pending" || plan.status === "confirmed");

		const lastUpdatedByName = plan.lastUpdatedBy === user?.id ? "You" : plan.friendName;

		const status = getDetailStatus(plan, isCreator, isPast, lastUpdatedByName);

		return (
			<>
				{/* Header */}
				<div className="shrink-0 border-b border-[#7f2f29] bg-[#943b32] px-6 py-3">
					<p className="text-sm font-bold uppercase tracking-[0.15em] text-[#f1c7bd]">Plan details</p>
				</div>

				<ScrollableContainer className="p-5 sm:p-6">
					<div className="mx-auto max-w-2xl space-y-5">
						{/* Main details */}
						<section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
							<div className="space-y-4 p-5">
								<div className="flex items-start gap-5">
									<p className="w-16 shrink-0 pt-0.5 text-xs font-semibold uppercase tracking-wide text-brand-muted">When</p>

									<p className="text-sm font-bold text-brand-text">{format(plan.meetTime, "EEEE, MMMM d 'at' h:mm a")}</p>
								</div>

								<div className="flex items-center gap-5">
									<p className="w-16 shrink-0 text-xs font-semibold uppercase tracking-wide text-brand-muted">With</p>

									<div className="flex items-center gap-2.5">
										<p className="text-sm font-bold text-brand-text">{plan.friendName}</p>
									</div>
								</div>

								{plan.location && (
									<div className="flex items-start gap-5">
										<p className="w-16 shrink-0 pt-0.5 text-xs font-semibold uppercase tracking-wide text-brand-muted">Where</p>

										<p className="text-sm font-bold text-brand-text">{plan.location}</p>
									</div>
								)}

								<div className="flex items-start gap-5">
									<p className="w-16 shrink-0 pt-0.5 text-xs font-semibold uppercase tracking-wide text-brand-muted">What</p>

									<div className="min-w-0">
										<p className="text-sm font-bold text-brand-text">{plan.title}</p>

										{plan.comments && <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-brand-muted">{plan.comments}</p>}
									</div>
								</div>
							</div>
						</section>

						{/* Status */}
						<section className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Status</p>

								<p className="mt-1 font-bold text-brand-text">{status.title}</p>
							</div>

							<span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}>{status.text}</span>
						</section>

						{/* Error */}
						{error && <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

						{/* Respond */}
						{canRespond && (
							<div className="flex justify-end gap-3">
								<button
									type="button"
									onClick={() => setConfirmAction(true)}
									disabled={isSubmitting}
									className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-bold text-brand-text transition hover:bg-[#faf7f0] disabled:cursor-not-allowed disabled:opacity-60"
								>
									Decline
								</button>

								<button
									type="button"
									onClick={() => handleAccept(plan)}
									disabled={isSubmitting}
									className="rounded-xl bg-[#943b32] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f2f29] disabled:cursor-not-allowed disabled:opacity-60"
								>
									{isSubmitting ? "Accepting..." : "Accept plan"}
								</button>
							</div>
						)}

						{/* Cancel */}
						{!canRespond && canCancel && (
							<div className="flex justify-end">
								<button
									type="button"
									onClick={() => setConfirmAction(true)}
									disabled={isSubmitting}
									className="rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
								>
									Cancel plan
								</button>
							</div>
						)}
					</div>
				</ScrollableContainer>

				{/* Confirmation overlay */}
				{confirmAction && (
					<div className="absolute inset-0 z-20 flex items-center justify-center bg-brand-text/20 px-5 backdrop-blur-[1px]">
						<div className="w-full max-w-xs rounded-2xl border border-stone-200 bg-[#fffdf9] p-5 shadow-xl">
							<div className="text-center">
								<p className="text-sm font-bold text-brand-text">{canRespond ? "Decline this plan?" : "Cancel this plan?"}</p>

								<p className="mt-1 text-xs font-medium text-brand-muted">This action cannot be undone.</p>
							</div>

							<div className="mt-4 flex gap-2">
								<button
									type="button"
									onClick={() => setConfirmAction(false)}
									disabled={isSubmitting}
									className="flex-1 rounded-xl border border-stone-200 bg-[#faf7f0] px-3 py-2 text-sm font-bold text-brand-text transition hover:bg-[#f3e9df] disabled:opacity-60"
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
				)}
			</>
		);
	}

	function getDetailStatus(plan: Plan, isCreator: boolean, isPast: boolean, lastUpdatedByName: string) {
		switch (plan.status) {
			case "confirmed":
				return {
					text: "Confirmed",
					title: isPast ? "This plan has expired" : "You're all set!",
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
						title: "This invite has expired",
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
}
