import { format, differenceInMinutes } from "date-fns";
import type { MatchedSchedule, Schedule } from "../../utils/types";
import { useState } from "react";
import { LoadingIndicator } from "../LoadingIndicator";
import { useSchedule } from "../../contexts/SchedulesContext";
import { useNavigate } from "react-router-dom";
import Avatar from "../common/Avatar";
import ScrollableContainer from "../common/ScrollableContainer";

type OverlapModalProps = {
	noteSchedule: Schedule;
	noteOverlaps: MatchedSchedule[];
	noteStartTime: Date;
	noteEndTime: Date;
	hasPassed: boolean;
	onClose: () => void;
	onDeleted: () => void;
};

export default function OverlapModal({ noteSchedule, noteOverlaps, noteStartTime, noteEndTime, hasPassed, onClose, onDeleted }: OverlapModalProps) {
	const [confirmDelete, setConfirmDelete] = useState(false);
	const { deleteUserSchedule } = useSchedule();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	//for the make plans button
	const navigate = useNavigate();

	const overlaps = noteOverlaps.sort((a, b) => a.startTime.getTime() - a.endTime.getTime() - (b.startTime.getTime() - b.endTime.getTime()));

	//delete button
	async function handleDeleteSchedule() {
		setLoading(true);

		deleteUserSchedule(noteSchedule.id)
			.then(() => {
				setLoading(false);
				onClose();
				onDeleted();
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
			<div
				className={`relative flex h-[80vh] max-h-175 w-full max-w-md flex-col overflow-hidden rounded-2xl border p-6 shadow-xl transition ${
					hasPassed ? "border-stone-300 bg-stone-100" : "border-stone-200 bg-amber-50"
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="shrink-0">
					<div className="flex items-start justify-between gap-4">
						<div>
							<h2 className={`text-lg font-bold ${hasPassed ? "text-brand-muted" : "text-brand-text"}`}>Who else is free?</h2>

							<p className={`mt-1 text-sm font-medium ${hasPassed ? "text-brand-muted/70" : "text-brand-muted"}`}>
								{format(noteStartTime, "EEEE, MMMM d")}
							</p>

							<p className={`text-sm font-medium ${hasPassed ? "text-brand-muted/70" : "text-brand-muted"}`}>
								{format(noteStartTime, "p")} - {format(noteEndTime, "p")}
							</p>
						</div>

						<button
							type="button"
							onClick={onClose}
							className="rounded-lg px-2 py-1 text-brand-muted transition hover:bg-stone-200 hover:text-brand-text"
						>
							✕
						</button>
					</div>
				</div>

				{/* Scrollable overlaps */}
				<ScrollableContainer className="mt-5">
					<div className="space-y-2">
						{overlaps.length > 0 ? (
							overlaps.map((overlap) => (
								<div
									key={overlap.id}
									className={`flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2.5 shadow-sm transition ${
										hasPassed ? "opacity-60" : ""
									}`}
								>
									<Avatar name={overlap.friendName} rawUrl={overlap.friendAvatarUrl} />

									{showFriendInfo(overlap)}

									<button
										type="button"
										disabled={hasPassed}
										onClick={() => {
											navigate("/plans", {
												state: { overlap },
											});
										}}
										className={`shrink-0 rounded-lg px-3 py-2 text-sm font-bold transition ${
											hasPassed ? "cursor-not-allowed bg-stone-200 text-brand-muted/70" : "bg-[#943b32] text-white hover:bg-[#7f2f29]"
										}`}
									>
										{hasPassed ? "Expired" : "Make plans!"}
									</button>
								</div>
							))
						) : (
							<p className={`text-sm font-medium ${hasPassed ? "text-brand-muted/70" : "text-brand-muted"}`}>
								None of your friends are free during this time.
							</p>
						)}
					</div>
				</ScrollableContainer>

				{/* Bottom */}
				<div className="shrink-0">
					{showLoading()}
					{showError()}

					<div className="mt-3 flex gap-2">{showDeleteButton()}</div>
				</div>
			</div>
		</div>
	);

	function showFriendInfo(overlap: MatchedSchedule) {
		const minutes = differenceInMinutes(overlap.endTime, overlap.startTime);

		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;

		let duration: string;

		if (hours === 0) {
			duration = `${minutes} min${minutes !== 1 ? "s" : ""}`;
		} else if (remainingMinutes === 0) {
			duration = `${hours} hr${hours !== 1 ? "s" : ""}`;
		} else {
			duration = `${hours} hr${hours !== 1 ? "s" : ""} ${remainingMinutes} min${remainingMinutes !== 1 ? "s" : ""}`;
		}

		// Keep semantic duration colors
		let durationStyle = "text-brand-muted";

		if (minutes >= 180) {
			durationStyle = "text-green-700";
		} else if (minutes >= 60) {
			durationStyle = "text-amber-700";
		}

		return (
			<div className="min-w-0 flex-1">
				<div className="truncate font-semibold text-brand-text">{overlap.friendName}</div>

				<p className={`mt-0.5 text-sm font-bold ${durationStyle}`}>{duration}</p>
			</div>
		);
	}

	function showLoading() {
		if (loading) {
			return (
				<div className="flex min-h-96 items-center justify-center">
					<LoadingIndicator variant="Loading" />
				</div>
			);
		}
	}

	function showError() {
		if (error) {
			return (
				<div role="alert" className="mt-3 px-4 py-3 text-center text-sm font-medium text-red-700">
					{error}
				</div>
			);
		}
	}

	function showDeleteButton() {
		return (
			<>
				{/* Delete action */}
				<button
					type="button"
					onClick={() => setConfirmDelete(true)}
					className="
						mt-3 w-full rounded-xl
						border border-red-200 bg-[#fffdf8]
						px-4 py-2.5
						font-bold text-red-600
						shadow-sm transition
						hover:border-red-300 hover:bg-[#faf7f0] hover:text-red-700
						active:bg-[#f3e9df]
					"
				>
					Delete schedule
				</button>

				{/* Confirmation overlay */}
				{confirmDelete && (
					<div className="absolute inset-0 z-20 flex items-center justify-center bg-brand-text/20 px-5 backdrop-blur-[1px]">
						<div className="w-full max-w-xs rounded-2xl border border-stone-200 bg-[#fffdf9] p-5 shadow-xl">
							{/* Confirmation text */}
							<div className="text-center">
								<p className="text-sm font-bold text-brand-text">Delete this schedule?</p>

								<p className="mt-1 text-xs font-medium text-brand-muted">This action cannot be undone.</p>
							</div>

							{/* Actions */}
							<div className="mt-4 flex gap-2">
								<button
									type="button"
									onClick={() => setConfirmDelete(false)}
									disabled={loading}
									className="
						flex-1 rounded-xl
						border border-stone-200 bg-[#faf7f0]
						px-3 py-2
						text-sm font-bold text-brand-text
						transition
						hover:bg-[#f3e9df]
						disabled:opacity-60
					"
								>
									Go back
								</button>

								<button
									type="button"
									onClick={handleDeleteSchedule}
									disabled={loading}
									className="
						flex-1 rounded-xl bg-red-600
						px-3 py-2
						text-sm font-bold text-white
						transition
						hover:bg-red-700
						disabled:cursor-not-allowed disabled:opacity-60
					"
								>
									{loading ? "Deleting..." : "Delete"}
								</button>
							</div>
						</div>
					</div>
				)}
			</>
		);
	}
}
