import { useState, type SubmitEvent } from "react";
import { addMinutes, differenceInMinutes, format } from "date-fns";
import type { MatchedScheduleData } from "../../utils/types";
import { usePlans } from "../../contexts/PlansContext";

type NewPlanModalProps = {
	overlap: MatchedScheduleData;
	friendName: string;
	onClose: () => void;
};

export default function NewPlanModal({ overlap, friendName, onClose }: NewPlanModalProps) {
	const [title, setTitle] = useState("");
	const [location, setLocation] = useState("");
	const [comments, setComments] = useState("");
	const [startOffset, setStartOffset] = useState(0);

	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { addPlan } = usePlans();

	const overlapMinutes = differenceInMinutes(overlap.endTime, overlap.startTime);

	// Keep at least 15 minutes between selected time and availability end
	const maxStartOffset = Math.max(0, overlapMinutes - 15);

	const meetTime = addMinutes(overlap.startTime, startOffset);

	async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		setError(null);
		setIsSubmitting(true);

		try {
			await addPlan(overlap.userId, title, comments, meetTime, location);

			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong while creating the plan.");
		} finally {
			setIsSubmitting(false);
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
			<div className="w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-brand-page shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-brand-red-dark bg-brand-red px-5 py-4">
					<h2 className="text-2xl font-bold text-brand-cream">New Plan</h2>

					<button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close">
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5 p-5">
					{/* Plan details */}
					<section>
						<div className="rounded-xl border border-stone-200 bg-brand-surface p-4">
							<div className="space-y-5">
								{/* When */}
								<div>
									<div className="flex items-baseline gap-4">
										<p className="plan-label">When</p>
										<p className="text-sm font-bold text-brand-text">{format(meetTime, "EEE, MMM d ' @ ' h:mm a")}</p>
									</div>

									{/* Time slider */}
									<div className="ml-18 mt-2">
										{showSlider()}
										<div className="mt-1.5 flex justify-between text-xs text-stone-muted">
											<span>{format(overlap.startTime, "h:mm a")}</span>
											<span>{format(overlap.endTime, "h:mm a")}</span>
										</div>
									</div>
								</div>

								{/* With */}
								<div className="flex items-baseline gap-4">
									<p className="plan-label">With</p>
									<p className="text-sm font-bold text-brand-text">{friendName}</p>
								</div>

								{/* Where */}
								<div className="flex items-start gap-3">
									<label htmlFor="plan-location" className="plan-label">
										Where
									</label>

									<input
										id="plan-location"
										type="text"
										maxLength={255}
										value={location}
										onChange={(event) => setLocation(event.target.value)}
										placeholder="Optional location"
										className="plan-input-field"
									/>
								</div>

								{/* What */}
								<div className="flex items-start gap-3">
									<label htmlFor="plan-title" className="plan-label">
										What
									</label>

									<div className="min-w-0 flex-1">
										<input
											id="plan-title"
											type="text"
											required
											maxLength={100}
											value={title}
											onChange={(event) => setTitle(event.target.value)}
											placeholder="Dinner, coffee, movie night..."
											className="plan-input-field"
										/>

										<textarea
											id="plan-comments"
											maxLength={500}
											rows={3}
											value={comments}
											onChange={(event) => setComments(event.target.value)}
											placeholder="Details..."
											className="mt-2 plan-input-field"
										/>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Error */}
					{error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

					{/* Actions */}
					<div className="flex justify-end gap-2">
						<button type="button" onClick={onClose} disabled={isSubmitting} className="btn-secondary min-w-1/4">
							Cancel
						</button>

						<button type="submit" disabled={isSubmitting} className="btn-primary min-w-1/4">
							{isSubmitting ? "Sending..." : "Send"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);

	function showSlider() {
		return (
			<input
				id="plan-start-time"
				type="range"
				min={0}
				max={maxStartOffset}
				step={15}
				value={startOffset}
				onChange={(event) => setStartOffset(Number(event.target.value))}
				aria-label="Plan start time"
				className="
					w-full cursor-pointer appearance-none bg-transparent

					[&::-webkit-slider-runnable-track]:h-1.5
					[&::-webkit-slider-runnable-track]:rounded-full
					[&::-webkit-slider-runnable-track]:bg-stone-200

					[&::-webkit-slider-thumb]:-mt-1.5
					[&::-webkit-slider-thumb]:h-4.5
					[&::-webkit-slider-thumb]:w-4.5
					[&::-webkit-slider-thumb]:appearance-none
					[&::-webkit-slider-thumb]:rounded-full
					[&::-webkit-slider-thumb]:bg-brand-red

					[&::-moz-range-track]:h-1.5
					[&::-moz-range-track]:rounded-full
					[&::-moz-range-track]:bg-stone-200

					[&::-moz-range-progress]:bg-stone-200

					[&::-moz-range-thumb]:h-4
					[&::-moz-range-thumb]:w-4
					[&::-moz-range-thumb]:rounded-full
					[&::-moz-range-thumb]:border-0
					[&::-moz-range-thumb]:bg-brand-red
				"
			/>
		);
	}
}
