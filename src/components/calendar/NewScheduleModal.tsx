import { useState, type SubmitEvent } from "react";
import type { ScheduleRepeatType } from "../../utils/types";

type NewScheduleModalProps = {
	onClose: () => void;
	onSubmit: (schedule: {
		date: string;
		startTime: string;
		endTime: string;
		repeatType: ScheduleRepeatType;
	}) => Promise<void> | void;

	initialDate?: string;
};

export default function NewScheduleModal({
	onClose,
	onSubmit,
	initialDate = "",
}: NewScheduleModalProps) {
	const [date, setDate] = useState(initialDate);
	const [startTime, setStartTime] = useState("18:00");
	const [endTime, setEndTime] = useState("21:00");
	const [repeatType, setRepeatType] = useState<ScheduleRepeatType>("once");
	const [allDay, setAllDay] = useState(false);

	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	/* ========================================================================= */
	//                        submit
	/* ========================================================================= */

	async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		setError(null);

		const submitStartTime = allDay ? "00:00" : startTime;
		const submitEndTime = allDay ? "23:59" : endTime;

		const scheduleStart = new Date(`${date}T${submitStartTime}`);
		const scheduleEnd = new Date(`${date}T${submitEndTime}`);

		if (!allDay && scheduleEnd <= scheduleStart) {
			setError("End time must be after start time.");
			return;
		}

		try {
			setIsSubmitting(true);

			await onSubmit({
				date,
				startTime: submitStartTime,
				endTime: submitEndTime,
				repeatType,
			});

			onClose();
		} catch {
			setError("Something went wrong while adding your availability.");
		} finally {
			setIsSubmitting(false);
		}
	}

	function setPreset(start: string, end: string) {
		setAllDay(false);
		setStartTime(start);
		setEndTime(end);
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
						<h2 className="text-xl font-bold text-[#fff3d6]">Add availability</h2>
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
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#943b32] text-sm font-bold text-white">
								1
							</div>

							<div>
								<p className="text-sm font-bold text-stone-800">Choose a date</p>
							</div>
						</div>

						<input
							id="availability-date"
							type="date"
							required
							value={date}
							onChange={(event) => setDate(event.target.value)}
							className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#b65a4f] focus:ring-2 focus:ring-[#b65a4f]/20"
						/>
					</section>

					<div className="border-t border-stone-200" />

					{/* Step 2 */}
					<section>
						<div className="mb-3 flex items-center gap-3">
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#943b32] text-sm font-bold text-white">
								2
							</div>

							<div>
								<p className="text-sm font-bold text-stone-800">Choose a time</p>
							</div>
						</div>

						{/* All day */}
						<div className="mb-4 flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3">
							<div>
								<p className="text-sm font-bold text-stone-800">All day</p>

								<p className="text-xs text-stone-500">Available for the entire day</p>
							</div>

							<button
								type="button"
								onClick={() => setAllDay((prev) => !prev)}
								aria-pressed={allDay}
								className={`relative h-6 w-11 shrink-0 rounded-full transition ${
									allDay ? "bg-[#943b32]" : "bg-stone-300"
								}`}
							>
								<span
									className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
										allDay ? "left-6" : "left-1"
									}`}
								/>
							</button>
						</div>

						{/* Quick select */}
						<div className={allDay ? "pointer-events-none opacity-40" : ""}>
							<p className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-500">
								Quick select
							</p>

							<div className="grid grid-cols-3 gap-2">
								<PresetButton label="Morning" onClick={() => setPreset("09:00", "12:00")} />

								<PresetButton label="Afternoon" onClick={() => setPreset("12:00", "17:00")} />

								<PresetButton label="Evening" onClick={() => setPreset("17:00", "22:00")} />
							</div>
						</div>

						{/* Custom time */}
						<div className="mt-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="availability-start"
										className="mb-1.5 block text-xs font-semibold text-stone-500"
									>
										Start
									</label>

									<input
										id="availability-start"
										type="time"
										step={900}
										required={!allDay}
										disabled={allDay}
										value={startTime}
										onChange={(event) => setStartTime(event.target.value)}
										className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#b65a4f] focus:ring-2 focus:ring-[#b65a4f]/20 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400"
									/>
								</div>

								<div>
									<label
										htmlFor="availability-end"
										className="mb-1.5 block text-xs font-semibold text-stone-500"
									>
										End
									</label>

									<input
										id="availability-end"
										type="time"
										step={900}
										required={!allDay}
										disabled={allDay}
										value={endTime}
										onChange={(event) => setEndTime(event.target.value)}
										className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#b65a4f] focus:ring-2 focus:ring-[#b65a4f]/20 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400"
									/>
								</div>
							</div>
						</div>
					</section>

					<div className="border-t border-stone-200" />

					{/* Step 3 */}
					<section>
						<div className="mb-3 flex items-center gap-3">
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#943b32] text-sm font-bold text-white">
								3
							</div>

							<div>
								<p className="text-sm font-bold text-stone-800">Select frequency</p>
							</div>
						</div>

						<select
							id="availability-repeat"
							value={repeatType}
							onChange={(event) => setRepeatType(event.target.value as ScheduleRepeatType)}
							className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#b65a4f] focus:ring-2 focus:ring-[#b65a4f]/20"
						>
							<option value="once">Once</option>
							<option value="daily">Daily</option>
							<option value="weekly">Weekly</option>
						</select>
					</section>

					{/* Error */}
					{error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

					{/* Actions */}
					<div className="flex justify-end gap-2 border-t border-stone-200 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="rounded-xl px-4 py-2.5 text-sm font-bold text-stone-600 transition hover:bg-stone-100"
						>
							Cancel
						</button>

						<button
							type="submit"
							disabled={isSubmitting}
							className="rounded-xl bg-[#943b32] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f2f29] disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isSubmitting ? "Adding..." : "Add availability"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

type PresetButtonProps = {
	label: string;
	onClick: () => void;
};

function PresetButton({ label, onClick }: PresetButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm font-bold text-stone-700 transition hover:border-[#b65a4f] hover:bg-[#fff4ef] hover:text-[#943b32]"
		>
			{label}
		</button>
	);
}
