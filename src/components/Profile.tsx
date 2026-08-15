import type { User } from "../utils/types";

type ProfileProps = {
	user: User;
};

export default function Profile({ user }: ProfileProps) {
	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
				{/* Header */}
				<div className="border-b border-stone-200 bg-[#fffdf8] px-5 py-5">
					<h2 className="text-2xl font-bold tracking-tight text-stone-800">Profile</h2>

					<p className="mt-0.5 text-sm text-stone-500">Your account information</p>
				</div>

				{/* Profile */}
				<div className="bg-[#faf7f0] p-3 sm:p-5">
					<div className="rounded-xl border border-stone-200 bg-[#fffdf9] p-5 shadow-sm">
						{/* User info */}
						<div className="flex items-center gap-4">
							{/* Avatar */}
							<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f3d6d1] text-xl font-bold text-[#a63c32]">
								{user.name.charAt(0).toUpperCase()}
							</div>

							<div className="min-w-0">
								<h3 className="truncate text-xl font-bold text-stone-800">{user.name}</h3>

								<p className="mt-0.5 truncate text-sm text-stone-500">{user.email}</p>
							</div>
						</div>

						{/* Account information */}
						<div className="mt-6 border-t border-stone-200 pt-5">
							<h3 className="text-sm font-bold text-stone-800">Account information</h3>

							<div className="mt-3 flex flex-col gap-3">
								<div className="rounded-lg border border-stone-200 bg-white px-4 py-3">
									<p className="text-xs font-bold uppercase tracking-wide text-stone-400">Name</p>

									<p className="mt-1 text-sm font-medium text-stone-700">{user.name}</p>
								</div>

								<div className="rounded-lg border border-stone-200 bg-white px-4 py-3">
									<p className="text-xs font-bold uppercase tracking-wide text-stone-400">Email</p>

									<p className="mt-1 text-sm font-medium text-stone-700">{user.email}</p>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="mt-5 flex justify-end">
							<button
								type="button"
								className="rounded-lg bg-[#d94b3d] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#c94034] active:scale-95"
							>
								Edit profile
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
