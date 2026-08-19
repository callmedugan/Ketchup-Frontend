import { useFriends } from "../../contexts/FriendsContext";

export default function FriendsList() {
	const { friends } = useFriends();

	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
				{/* Friends */}
				<div className="bg-[#faf7f0] p-3 sm:p-5">
					<div className="flex flex-col gap-3">
						{friends.map((friend) => (
							<div
								key={friend.userId}
								className="flex items-center justify-between rounded-xl border border-stone-200 bg-[#fffdf9] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
							>
								{/* Friend info */}
								<div className="flex min-w-0 items-center gap-3">
									{/* Avatar */}
									<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3d6d1] text-sm font-bold text-[#a63c32]">
										{friend.name.charAt(0).toUpperCase()}
									</div>

									<div className="min-w-0">
										<div className="truncate text-l font-bold text-stone-800">{friend.name}</div>
										<div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium">
											<span
												className={`h-1.5 w-1.5 rounded-full ${
													friend.status === "accepted" ? "bg-emerald-500" : friend.status === "requested" ? "bg-amber-500" : "bg-stone-400"
												}`}
											/>

											<span className="text-stone-500">
												{friend.status === "accepted" && "Friends"}
												{friend.status === "requested" && "Request pending"}
												{friend.status === "blocked" && "Request declined"}
											</span>
										</div>
									</div>
								</div>

								{/* Actions */}
								<button
									type="button"
									className="ml-3 shrink-0 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
								>
									View
								</button>
							</div>
						))}

						{/* Empty state */}
						{friends.length === 0 && (
							<div className="rounded-xl border border-dashed border-stone-300 bg-[#fffdf9] px-6 py-12 text-center">
								<h3 className="mt-4 font-bold text-stone-800">No friends yet</h3>

								<p className="mx-auto mt-1 max-w-sm text-sm text-stone-500">Add some friends to get the ball rolling.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
