import { useState } from "react";
import type { Friend } from "../../utils/types";
import { useFriends } from "../../contexts/FriendsContext";
import Avatar from "../common/Avatar";
import ScrollableContainer from "../common/ScrollableContainer";

type FriendDetailsPaneProps = {
	activeFriend: Friend | null;
};

export default function FriendDetailsPane({ activeFriend }: FriendDetailsPaneProps) {
	const { getStatusDisplay, acceptFriend, declineFriend, cancelFriendRequest, removeFriend, blockFriend, unblockFriend } = useFriends();

	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [confirmAction, setConfirmAction] = useState<"decline" | "cancel" | "remove" | "block" | "unblock" | null>(null);

	if (!activeFriend) {
		return (
			<div className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf8] shadow-sm">
				{showEmptyState()}
			</div>
		);
	}

	const friend = activeFriend;
	const status = getStatusDisplay(friend);

	/* ========================================================================= */
	// handlers
	/* ========================================================================= */
	//#region handlers
	async function handleAccept() {
		setError(null);
		setIsSubmitting(true);

		try {
			await acceptFriend(friend.id);
			setConfirmAction(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong while accepting the friend request.");
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleDecline() {
		setError(null);
		setIsSubmitting(true);

		try {
			await declineFriend(friend.id);
			setConfirmAction(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong while declining the friend request.");
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleCancelRequest() {
		setError(null);
		setIsSubmitting(true);

		try {
			await cancelFriendRequest(friend.id);
			setConfirmAction(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong while cancelling the friend request.");
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleRemove() {
		setError(null);
		setIsSubmitting(true);

		try {
			await removeFriend(friend.id);
			setConfirmAction(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong while removing this friend.");
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleBlock() {
		setError(null);
		setIsSubmitting(true);

		try {
			await blockFriend(friend.id);
			setConfirmAction(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong while blocking this user.");
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleUnblock() {
		setError(null);
		setIsSubmitting(true);

		try {
			await unblockFriend(friend.id);
			setConfirmAction(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong while unblocking this user.");
		} finally {
			setIsSubmitting(false);
		}
	}
	//#endregion

	/* ========================================================================= */
	// display
	/* ========================================================================= */

	function showHeader() {
		return (
			<div className="shrink-0 border-b border-brand-red-dark bg-brand-red px-6 py-3">
				<p className="text-sm font-bold uppercase tracking-wide text-brand-cream">Friend details</p>
			</div>
		);
	}

	function showProfile() {
		return (
			<section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
				<div className="p-5">
					<div className="flex items-center gap-4">
						<Avatar name={friend.name} rawUrl={friend.avatarUrl} />

						<div className="min-w-0">
							<h2 className="truncate text-xl font-bold text-brand-text">{friend.name}</h2>

							<span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${status?.className}`}>{status?.text}</span>
						</div>
					</div>

					{friend.bio && (
						<div className="mt-5 border-t border-stone-200 pt-4">
							<p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-muted">About</p>

							<p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-brand-text">{friend.bio}</p>
						</div>
					)}
				</div>
			</section>
		);
	}

	function showDetails() {
		return (
			<section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
				<div className="space-y-4 p-5">
					{friend.timezone && (
						<div className="flex items-start gap-5">
							<p className="plan-label">Timezone</p>

							<p className="text-sm font-bold text-brand-text">{friend.timezone}</p>
						</div>
					)}

					<div className="flex items-start gap-5">
						<p className="plan-label">Status</p>

						<span className={`rounded-full px-3 py-1.5 text-xs font-bold ${status?.className}`}>{status?.text}</span>
					</div>
				</div>
			</section>
		);
	}

	function showError() {
		if (!error) return null;

		return <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>;
	}

	function showActions() {
		if (friend.status === "requested" && friend.requestDirection === "received") {
			return (
				<div className="flex justify-end gap-3">
					<button type="button" onClick={() => setConfirmAction("decline")} disabled={isSubmitting} className="btn-secondary">
						Decline
					</button>

					<button type="button" onClick={handleAccept} disabled={isSubmitting} className="btn-primary">
						{isSubmitting ? "Accepting..." : "Accept request"}
					</button>
				</div>
			);
		}

		if (friend.status === "requested" && friend.requestDirection === "sent") {
			return (
				<div className="flex justify-end">
					<button type="button" onClick={() => setConfirmAction("cancel")} disabled={isSubmitting} className="btn-secondary">
						Cancel request
					</button>
				</div>
			);
		}

		if (friend.status === "accepted") {
			return (
				<div className="flex justify-end gap-3">
					<button type="button" onClick={() => setConfirmAction("remove")} disabled={isSubmitting} className="btn-secondary">
						Remove friend
					</button>

					<button type="button" onClick={() => setConfirmAction("block")} disabled={isSubmitting} className="btn-danger">
						Block
					</button>
				</div>
			);
		}

		if (friend.status === "blocked" && friend.requestDirection === "sent") {
			return (
				<div className="flex justify-end">
					<button type="button" onClick={() => setConfirmAction("unblock")} disabled={isSubmitting} className="btn-secondary">
						Unblock
					</button>
				</div>
			);
		}

		return null;
	}

	function showConfirmation() {
		if (!confirmAction) return null;

		const confirmation = getConfirmationDetails();

		return (
			<div className="absolute inset-0 z-20 flex items-center justify-center bg-brand-text/20 px-5 backdrop-blur-[1px]">
				<div className="w-full max-w-xs rounded-2xl border border-stone-200 bg-brand-card p-5 shadow-xl">
					<div className="text-center">
						<p className="text-sm font-bold text-brand-text">{confirmation.title}</p>

						<p className="mt-1 text-xs font-medium text-brand-muted">{confirmation.description}</p>
					</div>

					<div className="mt-4 flex gap-2">
						<button
							type="button"
							onClick={() => setConfirmAction(null)}
							disabled={isSubmitting}
							className="flex-1 rounded-xl border border-stone-200 bg-brand-surface px-3 py-2 text-sm font-bold text-brand-text transition hover:bg-[#f3e9df] disabled:opacity-60"
						>
							Go back
						</button>

						<button
							type="button"
							onClick={confirmation.action}
							disabled={isSubmitting}
							className={
								confirmAction === "block"
									? "flex-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
									: "flex-1 rounded-xl bg-brand-red px-3 py-2 text-sm font-bold text-brand-cream transition hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-60"
							}
						>
							{isSubmitting ? confirmation.loadingText : confirmation.buttonText}
						</button>
					</div>
				</div>
			</div>
		);
	}

	function getConfirmationDetails() {
		switch (confirmAction) {
			case "decline":
				return {
					title: "Decline this request?",
					description: "They won't be able to send another request.",
					buttonText: "Decline",
					loadingText: "Declining...",
					action: handleDecline,
				};

			case "cancel":
				return {
					title: "Cancel this request?",
					description: "This friend request will be removed.",
					buttonText: "Cancel request",
					loadingText: "Cancelling...",
					action: handleCancelRequest,
				};

			case "remove":
				return {
					title: "Remove this friend?",
					description: "You'll no longer be connected.",
					buttonText: "Remove",
					loadingText: "Removing...",
					action: handleRemove,
				};

			case "block":
				return {
					title: `Block ${friend.name}?`,
					description: "They won't be able to interact with you.",
					buttonText: "Block",
					loadingText: "Blocking...",
					action: handleBlock,
				};

			case "unblock":
				return {
					title: `Unblock ${friend.name}?`,
					description: "They'll be able to interact with you again.",
					buttonText: "Unblock",
					loadingText: "Unblocking...",
					action: handleUnblock,
				};

			default:
				throw new Error("Invalid confirmation action");
		}
	}

	return (
		<div className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#fffdf8] shadow-sm">
			{showHeader()}

			<ScrollableContainer className="p-5 sm:p-6">
				<div className="mx-auto max-w-2xl space-y-5">
					{showProfile()}
					{showDetails()}
					{showError()}
					{showActions()}
				</div>
			</ScrollableContainer>

			{showConfirmation()}
		</div>
	);
}

function showEmptyState() {
	return (
		<div className="flex h-full min-h-100 items-center justify-center p-8">
			<div className="max-w-sm text-center">
				<h2 className="text-lg font-bold text-brand-text">Select a friend</h2>

				<p className="mt-1 text-sm font-medium text-brand-muted">Choose someone from the list to see their profile and friendship status.</p>
			</div>
		</div>
	);
}
