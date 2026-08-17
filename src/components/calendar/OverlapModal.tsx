import { format } from "date-fns";
import type { FriendSchedule, Schedule } from "../../utils/types";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LoadingIndicator } from "../LoadingIndicator";

type OverlapModalProps = {
	schedule: Schedule;
	friends: FriendSchedule[];
	onClose: () => void;
	onDeleted: (ScheduleId: string) => void;
};

export default function OverlapModal({ schedule, friends, onClose, onDeleted }: OverlapModalProps) {
	const [confirmDelete, setConfirmDelete] = useState(false);
	const { authFetch, token } = useAuth();
	//standard
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	//#region handleDeleteSchedule
	async function handleDeleteSchedule() {
		setLoading(true);
		authFetch(`${import.meta.env.VITE_API_URL}/api/schedules`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: schedule.id,
			}),
		})
			.then((response) => {
				if (!response.ok) throw new Error("Could not connect to server");
				setLoading(false);
				onClose();
				onDeleted(schedule.id);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}
	//#endregion

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
			onClick={onClose}
		>
			<div
				className="w-full max-w-md rounded-2xl border border-stone-200 bg-amber-50 p-6 shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2 className="text-lg font-bold text-stone-800">Who else is free?</h2>

						<p className="mt-1 text-sm text-stone-500">
							{format(schedule.startTime, "EEEE, MMMM d")}
						</p>

						<p className="text-sm text-stone-500">
							{format(schedule.startTime, "p")} - {format(schedule.endTime, "p")}
						</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="rounded-lg px-2 py-1 text-stone-500 transition hover:bg-stone-200 hover:text-stone-800"
					>
						✕
					</button>
				</div>

				<div className="mt-5 space-y-2">
					{friends.length > 0 ? (
						friends.map((friend) => (
							<div
								key={friend.id}
								className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2.5 shadow-sm"
							>
								{/* Avatar */}
								<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3d6d1] text-sm font-bold text-[#a63c32]">
									{friend.friendName.charAt(0).toUpperCase()}
								</div>

								{/* Friend info */}
								<div className="min-w-0 flex-1">
									<div className="truncate font-semibold text-stone-800">{friend.friendName}</div>

									<p className="text-sm text-stone-500">
										{format(friend.startTime, "p")} – {format(friend.endTime, "p")}
									</p>
								</div>

								{/* Action */}
								<button
									type="button"
									className="shrink-0 rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-600"
								>
									Make plans!
								</button>
							</div>
						))
					) : (
						<p className="text-sm text-stone-500">
							None of your friends overlap with this time yet.
						</p>
					)}
				</div>
				{showLoading()}
				{showError()}
				<div className="mt-3 flex gap-2">{showDeleteButton()}</div>
			</div>
		</div>
	);

	function showLoading() {
		if (loading) {
			return (
				<>
					<div className="flex min-h-96 items-center justify-center">
						<LoadingIndicator variant="Loading" />
					</div>
				</>
			);
		}
	}
	function showError() {
		if (error) {
			return (
				<>
					<div role="alert" className="mt-3  px-4 py-3 text-center text-sm text-red-700">
						{error}
					</div>
				</>
			);
		}
	}
	function showDeleteButton() {
		return (
			<>
				{confirmDelete ? (
					<div className="w-full mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
						<p className=" text-center text-sm font-semibold text-stone-700">
							Are you sure you want to delete this schedule?
						</p>

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
