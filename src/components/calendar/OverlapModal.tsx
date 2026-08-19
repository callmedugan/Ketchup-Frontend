import { format, differenceInMinutes } from "date-fns";
import type { MatchedSchedule, Schedule } from "../../utils/types";
import { useState } from "react";
import { LoadingIndicator } from "../LoadingIndicator";
import { useSchedule } from "../../contexts/SchedulesContext";
import { useNavigate } from "react-router-dom";

type OverlapModalProps = {
	noteSchedule: Schedule;
	noteOverlaps: MatchedSchedule[];
	hasPassed: boolean;
	onClose: () => void;
	onDeleted: () => void;
};

export default function OverlapModal({ noteSchedule, noteOverlaps, hasPassed, onClose, onDeleted }: OverlapModalProps) {
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
				className={`w-full max-w-md rounded-2xl border p-6 shadow-xl transition ${
					hasPassed ? "border-stone-300 bg-stone-100" : "border-stone-200 bg-amber-50"
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2 className={`text-lg font-bold ${hasPassed ? "text-stone-600" : "text-stone-800"}`}>Who else is free?</h2>

						<p className={`mt-1 text-sm ${hasPassed ? "text-stone-400" : "text-stone-500"}`}>{format(noteSchedule.startTime, "EEEE, MMMM d")}</p>

						<p className={`text-sm ${hasPassed ? "text-stone-400" : "text-stone-500"}`}>
							{format(noteSchedule.startTime, "p")} - {format(noteSchedule.endTime, "p")}
						</p>

						{hasPassed && (
							<p className="mt-2 inline-block rounded-full bg-stone-200 px-2.5 py-1 text-xs font-bold text-stone-600">Past availability</p>
						)}
					</div>

					<button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-stone-500 transition hover:bg-stone-200 hover:text-stone-800">
						✕
					</button>
				</div>

				<div className="mt-5 space-y-2">
					{overlaps.length > 0 ? (
						overlaps.map((overlap) => (
							<div
								key={overlap.id}
								className={`flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2.5 shadow-sm transition ${
									hasPassed ? "opacity-60" : ""
								}`}
							>
								{/* Avatar */}
								<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3d6d1] text-sm font-bold text-[#a63c32]">
									{overlap.friendName.charAt(0).toUpperCase()}
								</div>

								{/* Friend info */}
								{showFriendInfo(overlap)}

								{/* Button */}
								<button
									type="button"
									disabled={hasPassed}
									onClick={() => {
										navigate("/plans", { state: { overlap } });
									}}
									className={`shrink-0 rounded-lg px-3 py-2 text-sm font-bold transition ${
										hasPassed ? "cursor-not-allowed bg-stone-200 text-stone-400" : "bg-[#943b32] text-white hover:bg-[#7f2f29]"
									}`}
								>
									{hasPassed ? "Expired" : "Make plans!"}
								</button>
							</div>
						))
					) : (
						<p className={`text-sm ${hasPassed ? "text-stone-400" : "text-stone-500"}`}>None of your friends are free during this time.</p>
					)}
				</div>

				{showLoading()}
				{showError()}

				<div className="mt-3 flex gap-2">{showDeleteButton()}</div>
			</div>
		</div>
	);

	function showFriendInfo(overlap: MatchedSchedule) {
		const minutes = differenceInMinutes(overlap.endTime, overlap.startTime);

		// format duration
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

		// duration color
		let durationStyle = "text-stone-500";

		if (minutes >= 180) {
			durationStyle = "text-green-700";
		} else if (minutes >= 60) {
			durationStyle = "text-amber-700";
		}

		return (
			<div className="min-w-0 flex-1">
				<div className="truncate font-semibold text-stone-800">{overlap.friendName}</div>

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
				<div role="alert" className="mt-3 px-4 py-3 text-center text-sm text-red-700">
					{error}
				</div>
			);
		}
	}

	function showDeleteButton() {
		return (
			<>
				{confirmDelete ? (
					<div className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 p-3">
						<p className="text-center text-sm font-semibold text-stone-700">Are you sure you want to delete this schedule?</p>

						<div className="mt-3 flex gap-2">
							<button
								type="button"
								onClick={() => setConfirmDelete(false)}
								className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
							>
								Cancel
							</button>

							<button
								type="button"
								onClick={handleDeleteSchedule}
								className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-600"
							>
								Yes, delete
							</button>
						</div>
					</div>
				) : (
					<button
						type="button"
						onClick={() => setConfirmDelete(true)}
						className="mt-3 w-full rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 font-bold text-red-700 transition hover:border-red-400 hover:bg-red-100 active:bg-red-200"
					>
						Delete schedule
					</button>
				)}
			</>
		);
	}
}
