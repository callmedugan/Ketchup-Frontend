import { useState } from "react";
import type { Friend } from "../../utils/types";
import { useFriends } from "../../contexts/FriendsContext";
import Avatar from "../common/Avatar";
import ScrollableContainer from "../common/ScrollableContainer";

type FriendsListPaneProps = {
	activeFriend: Friend | null;
	onSelectFriend: (friend: Friend) => void;
};

export default function FriendsListPane({ activeFriend, onSelectFriend }: FriendsListPaneProps) {
	const { friends, getStatusDisplay } = useFriends();

	const [showFriendsOnly, setShowFriendsOnly] = useState(true);

	const visibleFriends = friends
		.filter((friend) => {
			if (showFriendsOnly) return friend.status === "accepted";
			return friend.status === "requested" && friend.requestDirection === "received";
		})
		.sort((a, b) => a.name.localeCompare(b.name));

	function showFilterTabs() {
		return (
			<div className="grid shrink-0 grid-cols-2 border-b border-stone-200 bg-brand-card">
				<button
					type="button"
					onClick={() => setShowFriendsOnly(true)}
					className={`
						border-r border-stone-200 px-4 py-3
						text-sm font-bold transition
						${showFriendsOnly ? "bg-brand-red text-brand-cream" : "text-brand-muted hover:bg-[#f3e9df] hover:text-brand-text"}
					`}
				>
					Friends
				</button>

				<button
					type="button"
					onClick={() => setShowFriendsOnly(false)}
					className={`
						px-4 py-3 text-sm font-bold transition
						${!showFriendsOnly ? "bg-brand-red text-brand-cream" : "text-brand-muted hover:bg-[#f3e9df] hover:text-brand-text"}
					`}
				>
					Requests
				</button>
			</div>
		);
	}

	function showFriends() {
		return (
			<ScrollableContainer className="p-3 sm:p-4">
				<div className="flex flex-col gap-2.5">
					{visibleFriends.map((friend) => showFriend(friend))}

					{visibleFriends.length === 0 && showEmptyState()}
				</div>
			</ScrollableContainer>
		);
	}

	function showFriend(friend: Friend) {
		const isSelected = activeFriend?.id === friend.id;
		const status = getStatusDisplay(friend);

		return (
			<button
				key={friend.id}
				type="button"
				onClick={() => onSelectFriend(friend)}
				className={`group list-item ${isSelected ? "list-item-selected" : ""}`}
			>
				<div className="flex min-w-0 items-center gap-3">
					<Avatar name={friend.name} rawUrl={friend.avatarUrl} />

					<div className="min-w-0">
						<div className="flex items-center gap-2">
							<h3 className="truncate font-bold text-brand-text">{friend.name}</h3>
							{friend.status !== "accepted" && (
								<span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${status?.className}`}>{status?.text}</span>
							)}
						</div>

						{friend.bio && <p className="mt-0.5 truncate text-xs font-medium text-brand-muted">{friend.bio}</p>}
					</div>
				</div>

				{showArrow(isSelected)}
			</button>
		);
	}

	function showArrow(isSelected: boolean) {
		return (
			<svg
				viewBox="0 0 20 20"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={`
					ml-3 h-5 w-5 shrink-0 transition
					${isSelected ? "translate-x-0.5 text-brand-red" : "text-brand-muted/40 group-hover:translate-x-0.5 group-hover:text-brand-muted"}
				`}
			>
				<path d="M7 4l6 6-6 6" />
			</svg>
		);
	}

	function showEmptyState() {
		return (
			<div className="rounded-xl border border-dashed border-stone-300 bg-brand-card px-5 py-10 text-center">
				<h3 className="font-bold text-brand-text">{showFriendsOnly ? "No friends yet" : "No connections yet"}</h3>

				<p className="mx-auto mt-1 max-w-sm text-sm font-medium text-brand-muted">
					{showFriendsOnly ? "Add some friends!" : "Friend requests and connections will show up here."}
				</p>
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-brand-surface shadow-sm">
			{showFilterTabs()}
			{showFriends()}
		</div>
	);
}
