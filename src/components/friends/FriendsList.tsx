import { useFriends } from "../../contexts/FriendsContext";
import Avatar from "../common/Avatar";
import ScrollableContainer from "../common/ScrollableContainer";

export default function FriendsList() {
	const { friends } = useFriends();

	return (
		<div className="flex h-full min-h-0 w-full flex-col">
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
				<ScrollableContainer className="bg-brand-surface p-3 pb-10 sm:p-5 sm:pb-10">
					<div className="flex flex-col gap-3">
						{friends.map((friend) => (
							<button
								key={friend.id}
								type="button"
								onClick={() => {
									// open friend details
								}}
								className="
									group flex w-full items-center justify-between card
									p-4 text-left transition
									hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md
									active:translate-y-0 active:shadow-sm
								"
							>
								{/* Friend info */}
								<div className="flex min-w-0 items-center gap-3">
									<Avatar name={friend.name} rawUrl={friend.avatarUrl} />

									<div className="min-w-0">
										<div className="truncate text-lg font-bold text-brand-text">{friend.name}</div>

										<div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium">
											<span
												className={`h-1.5 w-1.5 rounded-full ${
													friend.status === "accepted" ? "bg-emerald-500" : friend.status === "requested" ? "bg-amber-500" : "bg-stone-400"
												}`}
											/>

											<span className="text-brand-muted">
												{friend.status === "accepted" && "Friends"}
												{friend.status === "requested" && "Request pending"}
												{friend.status === "blocked" && "Request declined"}
											</span>
										</div>
									</div>
								</div>

								{/* Click indicator */}
								<svg
									viewBox="0 0 20 20"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="
									ml-4 h-5 w-5 shrink-0
									text-brand-muted/50 transition
									group-hover:translate-x-0.5
									group-hover:text-brand-muted
								"
								>
									<path d="M7 4l6 6-6 6" />
								</svg>
							</button>
						))}

						{/* Empty state */}
						{friends.length === 0 && (
							<div className="rounded-xl border border-dashed border-stone-300 bg-brand-card px-6 py-12 text-center">
								<h3 className="mt-4 font-bold text-brand-text">No friends yet</h3>

								<p className="mx-auto mt-1 max-w-sm text-sm font-medium text-brand-muted">Add some friends to get started!</p>
							</div>
						)}
					</div>
				</ScrollableContainer>
			</div>
		</div>
	);
}
