import { useState } from "react";
import type { Friend, UserSearchResult } from "../../utils/types";
import { useFriends } from "../../contexts/FriendsContext";
import FriendsListPane from "./FriendsListPane";
import FriendDetailsPane from "./FriendDetailsPane";

export type SelectedFriendUser = { type: "friend"; data: Friend } | { type: "search"; data: UserSearchResult };

export default function FriendsSplitView() {
	const { friends } = useFriends();

	const [selectedUser, setSelectedUser] = useState<SelectedFriendUser | null>(null);

	let activeUser: SelectedFriendUser | null = selectedUser;

	if (selectedUser) {
		const currentFriend = friends.find((friend) => friend.id === selectedUser.data.id);

		if (currentFriend) {
			// this user currently has a relationship
			activeUser = { type: "friend", data: currentFriend };
		} else if (selectedUser.type === "friend") {
			// relationship was removed, keep showing their public profile
			activeUser = {
				type: "search",
				data: {
					id: selectedUser.data.id,
					name: selectedUser.data.name,
					avatarUrl: selectedUser.data.avatarUrl,
					bio: selectedUser.data.bio,
					timezone: selectedUser.data.timezone,
				},
			};
		}
	}

	return (
		<div className="grid min-h-0 flex-1 grid-cols-[minmax(300px,0.85fr)_minmax(0,1.35fr)] gap-4">
			<FriendsListPane activeUser={activeUser} onSelectUser={setSelectedUser} onClearSelection={() => setSelectedUser(null)} />
			<FriendDetailsPane activeUser={activeUser} />
		</div>
	);
}
