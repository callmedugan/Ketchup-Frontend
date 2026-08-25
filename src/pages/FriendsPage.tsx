import { useState } from "react";
import AddFriendModal from "../components/friends/AddFriendModal";
import PageContainer from "./PageContainer";
import FriendsSplitView from "../components/friends/FriendsSplitView";

export function FriendsPage() {
	const [showAddFriendModal, setShowAddFriendModal] = useState(false);

	/* ========================================================================= */
	//                        page
	/* ========================================================================= */

	return (
		<PageContainer title="Your friends" description="See who's free to hang out.">
			<FriendsSplitView />

			{showAddFriendModal && <AddFriendModal onClose={() => setShowAddFriendModal(false)} />}
		</PageContainer>
	);

	// function showAddButton() {
	// 	return (
	// 		<button
	// 			type="button"
	// 			onClick={() => {
	// 				setShowAddFriendModal(true);
	// 			}}
	// 			className="btn-primary"
	// 		>
	// 			Find friend
	// 		</button>
	// 	);
	// }
}
