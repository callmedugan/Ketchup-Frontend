import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import FriendsList from "../components/friends/FriendsList";
import AddFriendModal from "../components/friends/AddFriendModal";
import PageContainer from "./PageContainer";

export function FriendsPage() {
	const { user } = useAuth();

	const [showAddFriendModal, setShowAddFriendModal] = useState(false);

	/* ========================================================================= */
	//                        page
	/* ========================================================================= */

	return (
		<PageContainer>
			{getContent()}

			{showAddFriendModal && (
				<AddFriendModal
					onClose={() => {
						setShowAddFriendModal(false);
					}}
				/>
			)}
		</PageContainer>
	);

	function getContent() {
		return (
			<div className="flex min-h-0 flex-1 flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
				{/* Page heading */}
				<div className="mb-7 flex shrink-0 items-end justify-between gap-4">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">Your friends</p>

						{user && <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-text">Hello, {user.name.split(" ")[0]}!</h1>}

						<p className="mt-1 text-sm font-medium text-brand-muted">See who you're able to hang out with.</p>
					</div>

					<button
						type="button"
						onClick={() => {
							setShowAddFriendModal(true);
						}}
						className="shrink-0 rounded-xl bg-[#943b32] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f2f29] active:scale-95"
					>
						+ Add friend
					</button>
				</div>

				{/* Friends */}
				<div className="min-h-0 flex-1">
					<FriendsList />
				</div>
			</div>
		);
	}
}
