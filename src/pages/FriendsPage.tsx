import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import NavBar from "../components/NavBar";
import FriendsList from "../components/friends/FriendsList";
import AddFriendModal from "../components/friends/AddFriendModal";

export function FriendsPage() {
	const { user } = useAuth();

	const [showAddFriendModal, setShowAddFriendModal] = useState(false);

	/* ========================================================================= */
	//                        page
	/* ========================================================================= */

	return (
		<div className="flex min-h-screen bg-[#b8794f] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12)_0_1px,transparent_1px),radial-gradient(circle_at_80%_70%,rgba(80,40,20,0.12)_0_1px,transparent_1px)] bg-size[11px_11px,17px_17px]">
			<NavBar />

			<main className="m-5 flex-1 overflow-hidden rounded-3xl border border-stone-300/70 bg-[#f7f1e5] shadow-[0_10px_30px_rgba(60,30,15,0.18)] lg:m-7">
				{getContent()}
			</main>

			{/* new friend modal */}
			{showAddFriendModal && (
				<AddFriendModal
					onClose={() => {
						setShowAddFriendModal(false);
					}}
				/>
			)}
		</div>
	);

	function getContent() {
		return (
			<div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
				{/* Page heading */}
				<div className="mb-7  flex items-end justify-between gap-4">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Your friends</p>

						{user && <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">Hello, {user.name.split(" ")[0]}!</h1>}

						<p className="mt-1 text-sm text-stone-500">See who you're able to hang out with.</p>
					</div>

					{/* Add availability */}
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
				<FriendsList />
			</div>
		);
	}
}
