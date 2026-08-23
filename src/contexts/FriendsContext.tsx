import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { useAuth } from "./AuthContext";
import { getFriendsFromParsedJson, isPresetAvatar, type Friend } from "../utils/types";

/* ========================================================================= */
//                        context
/* ========================================================================= */

//#region context

type FriendsContextType = {
	friends: Friend[];
	fetchFriends: () => Promise<Friend[]>;
	getFriendById: (id: string) => Friend | undefined;
	addFriend: (friendId: string) => Promise<Friend[]>;
	deleteFriend: (friendId: string) => Promise<Friend[]>;
};

const FriendsContext = createContext<FriendsContextType | null>(null);

//#endregion

/* ========================================================================= */
//                        provider
/* ========================================================================= */

//#region provider

type FriendsProviderProps = {
	children: ReactNode;
};

export const FriendsProvider = ({ children }: FriendsProviderProps) => {
	// needs to be nested inside AuthProvider
	const { user, authFetch } = useAuth();

	const [friends, setFriends] = useState<Friend[]>([]);

	// fetch friends when user updates
	useEffect(() => {
		if (!user) {
			setFriends([]);
			return;
		}

		fetchFriends();
	}, [user]);

	//#region api calls

	async function fetchFriends(): Promise<Friend[]> {
		const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/friends`);

		const data = await response.json();
		if (!response.ok) throw new Error(data.error);

		const friendData = getFriendsFromParsedJson(data);
		if (friendData === undefined) throw new Error("Friend data invalid");

		//make avatarUrls
		for (const f of friendData) {
			if (isPresetAvatar(f.avatarUrl)) f.avatarUrl = `/avatars/${f.avatarUrl}.webp`;
		}

		setFriends(friendData);

		return friendData;
	}

	async function addFriend(friendId: string): Promise<Friend[]> {
		const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/friends`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				friendId,
			}),
		});

		if (!response.ok) {
			const data = await response.json();
			throw new Error(data.error);
		}

		return fetchFriends();
	}

	async function deleteFriend(friendId: string): Promise<Friend[]> {
		const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/friends`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				friendId,
			}),
		});

		if (!response.ok) {
			const data = await response.json();
			throw new Error(data.error);
		}

		return fetchFriends();
	}

	//#endregion

	function getFriendById(id: string): Friend | undefined {
		return friends.find((friend) => friend.userId === id);
	}

	return (
		<FriendsContext.Provider
			value={{
				friends,
				fetchFriends,
				getFriendById,
				addFriend,
				deleteFriend,
			}}
		>
			{children}
		</FriendsContext.Provider>
	);
};

//#endregion

/* ========================================================================= */
//                        hook
/* ========================================================================= */

//#region hook

export function useFriends(): FriendsContextType {
	const context = useContext(FriendsContext);

	if (!context) {
		throw new Error("useFriends must be used within a FriendsProvider");
	}

	return context;
}

//#endregion
