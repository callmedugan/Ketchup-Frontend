import { useState, type SubmitEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserSearchResultsFromParsedJson, type UserSearchResult } from "../../utils/types";
import { useFriends } from "../../contexts/FriendsContext";
import Avatar from "../common/Avatar";

type AddFriendModalProps = {
	onClose: () => void;
};

export default function AddFriendModal({ onClose }: AddFriendModalProps) {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState<UserSearchResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [addingFriendId, setAddingFriendId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const { authFetch } = useAuth();
	const { friends, addFriend } = useFriends();

	async function handleSearch(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		// validate search
		const trimmedSearch = search.trim();

		if (!trimmedSearch) {
			setError("Enter a name or email.");
			return;
		}

		setError(null);
		setIsSearching(true);

		// build query params
		const params = new URLSearchParams({
			search: trimmedSearch,
		});

		authFetch(`${import.meta.env.VITE_API_URL}/api/users?${params.toString()}`)
			.then((response) => {
				if (!response.ok) throw new Error("Could not connect to server");
				return response.json();
			})
			.then((data) => {
				const searchData = getUserSearchResultsFromParsedJson(data);
				if (searchData == null) throw new Error("Could not find any users");

				setResults(searchData);

				return searchData;
			})
			.catch((err) => {
				setError(err instanceof Error ? err.message : "Unable to search for users.");
			})
			.finally(() => {
				setIsSearching(false);
			});
	}

	//called by add friend button
	async function handleAddFriend(friendId: string) {
		setError(null);
		setAddingFriendId(friendId);

		addFriend(friendId)
			.catch((err) => {
				setError(err instanceof Error ? err.message : "Unable to send friend request.");
			})
			.finally(() => {
				setAddingFriendId(null);
			});
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
			{/* Fixed-size modal */}
			<div className="flex h-150 w-full max-w-md flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf8] shadow-2xl">
				{/* Header */}
				<div className="flex shrink-0 items-center justify-between border-b border-[#7f2f29] bg-[#943b32] px-5 py-4">
					<div>
						<h2 className="text-xl font-bold text-[#fff3d6]">Add a friend</h2>
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

				{/* Modal content */}
				<div className="flex min-h-0 flex-1 flex-col p-5">
					{/* Search */}
					<form onSubmit={handleSearch} className="shrink-0">
						<div className="mb-3 flex items-center gap-3">
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#943b32] text-sm font-bold text-white">1</div>

							<p className="text-sm font-bold text-stone-800">Find a friend</p>
						</div>

						<div className="flex gap-2">
							<input
								type="text"
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder="Enter a name..."
								className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#b65a4f] focus:ring-2 focus:ring-[#b65a4f]/20"
							/>

							<button
								type="submit"
								disabled={isSearching}
								className="rounded-xl bg-[#943b32] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f2f29] disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isSearching ? "Searching..." : "Search"}
							</button>
						</div>
					</form>

					<div className="my-5 shrink-0 border-t border-stone-200" />

					{/* Results */}
					<section className="flex min-h-0 flex-1 flex-col">
						<div className="mb-3 flex shrink-0 items-center gap-3">
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#943b32] text-sm font-bold text-white">2</div>

							<p className="text-sm font-bold text-stone-800">Search results</p>
						</div>

						{/* Scrollable results area */}
						<div className="min-h-0 flex-1 overflow-y-auto pr-1">
							{results.length === 0 ? (
								<div className="flex h-full items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 text-center">
									<p className="text-xs text-stone-500">Search for a Ketchup user above.</p>
								</div>
							) : (
								<div className="space-y-2">
									{results.map((user) => {
										//check if user is already friend
										const friend = friends.find((friend) => friend.userId === user.id);

										const isAdding = addingFriendId === user.id;

										return (
											<div key={user.id} className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
												{/* User */}
												<div className="flex min-w-0 items-center gap-3">
													{/* avatar */}
													<Avatar name={user.name} rawUrl={user.avatarUrl} />
													{/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3d6d1] text-sm font-bold text-[#943b32]">
														{user.name.charAt(0).toUpperCase()}
													</div> */}

													<div className="min-w-0">
														<p className="truncate text-sm font-bold text-stone-800">{user.name}</p>
													</div>
												</div>

												{/* Add */}
												<button
													type="button"
													//disabled if adding or is friends
													disabled={friend !== undefined || isAdding}
													onClick={() => handleAddFriend(user.id)}
													className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition ${
														friend !== undefined ? "bg-stone-100 text-stone-500" : "bg-[#943b32] text-white hover:bg-[#7f2f29]"
													} disabled:cursor-not-allowed`}
												>
													{isAdding
														? "Adding..."
														: friend?.status === "requested"
															? "Requested"
															: friend?.status === "accepted"
																? "Accepted"
																: "Add friend"}
												</button>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</section>

					{/* Error */}
					{error && <p className="mt-4 shrink-0 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
				</div>
			</div>
		</div>
	);
}
