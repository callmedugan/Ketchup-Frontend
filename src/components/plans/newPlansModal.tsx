import { useState, type SubmitEvent } from "react";
import { format } from "date-fns";
import type { MatchedSchedule } from "../../utils/types";
import { usePlans } from "../../contexts/PlansContext";

type NewPlanModalProps = {
	overlap: MatchedSchedule;
	friendName: string;
	onClose: () => void;
};

export default function NewPlanModal({ overlap, friendName, onClose }: NewPlanModalProps) {
	const [title, setTitle] = useState("");
	const [comments] = useState("");
	const [meetTime] = useState(overlap.startTime);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { addPlan } = usePlans();

	async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		setError(null);
		setIsSubmitting(true);

		addPlan(overlap.userId, title, comments, meetTime)
			.then((response) => {
				console.log(response);
				onClose();
			})
			.catch((err) => {
				setError(err instanceof Error ? err.message : "Something went wrong while creating the plan.");
			})
			.finally(() => {
				setIsSubmitting(false);
			});
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
			<div className="w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf8] shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-[#7f2f29] bg-[#943b32] px-5 py-4">
					<div>
						<h2 className="text-xl font-bold text-[#fff3d6]">Make plans</h2>

						<p className="mt-0.5 text-sm text-[#f7ddd4]">With {friendName}</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-[#f7ddd4] transition hover:bg-white/10 hover:text-white"
						aria-label="Close"
					>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6 p-5">
					{/* Step 1 */}
					<section>
						<div className="mb-3 flex items-center gap-3">
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#943b32] text-sm font-bold text-white">1</div>

							<p className="text-sm font-bold text-stone-800">Your shared availability</p>
						</div>

						<div className="rounded-xl border border-stone-200 bg-white p-4">
							<p className="text-sm font-bold text-stone-800">{format(overlap.startTime, "EEEE, MMMM d")}</p>

							<p className="mt-1 text-sm text-stone-500">
								{format(overlap.startTime, "h:mm a")} – {format(overlap.endTime, "h:mm a")}
							</p>
						</div>
					</section>

					<div className="border-t border-stone-200" />

					{/* Step 2 */}
					<section>
						<div className="mb-3 flex items-center gap-3">
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#943b32] text-sm font-bold text-white">2</div>

							<p className="text-sm font-bold text-stone-800">What are you planning?</p>
						</div>

						<label htmlFor="plan-title" className="mb-1.5 block text-xs font-semibold text-stone-500">
							Plan name
						</label>

						<input
							id="plan-title"
							type="text"
							required
							maxLength={100}
							value={title}
							onChange={(event) => setTitle(event.target.value)}
							placeholder="Dinner, coffee, movie night..."
							className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#b65a4f] focus:ring-2 focus:ring-[#b65a4f]/20"
						/>
					</section>

					{/* Error */}
					{error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

					{/* Actions */}
					<div className="flex justify-end gap-2 border-t border-stone-200 pt-4">
						<button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-bold text-stone-600 transition hover:bg-stone-100">
							Cancel
						</button>

						<button
							type="submit"
							disabled={isSubmitting}
							className="rounded-xl bg-[#943b32] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f2f29] disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isSubmitting ? "Creating..." : "Create plan"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
