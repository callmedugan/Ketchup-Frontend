import { useState } from "react";
import type { Friend } from "../../utils/types";
import { useFriends } from "../../contexts/FriendsContext";
import FriendsListPane from "./FriendsListPane";
import FriendDetailsPane from "./FriendDetailsPane";

export default function FriendsSplitView() {
	const { friends } = useFriends();

	const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

	const activeFriend = selectedFriend ? (friends.find((friend) => friend.id === selectedFriend.id) ?? selectedFriend) : null;

	return (
		<div className="grid min-h-0 flex-1 grid-cols-[minmax(300px,0.85fr)_minmax(0,1.35fr)] gap-4">
			<FriendsListPane activeFriend={activeFriend} onSelectFriend={setSelectedFriend} />

			<FriendDetailsPane activeFriend={activeFriend} />
		</div>
	);
}
