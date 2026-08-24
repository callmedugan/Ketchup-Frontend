import type { User } from "../../utils/types";
import Avatar from "../common/Avatar";

type ProfileProps = {
	user: User;
};

export default function Profile({ user }: ProfileProps) {
	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
				{/* Profile */}
				<div className="bg-[#faf7f0] p-3 sm:p-5">
					<div className="rounded-xl border border-stone-200 bg-[#fffdf9] p-5 shadow-sm">
						{/* User info */}
						<div className="flex items-center gap-4">
							{/* Avatar */}
							<Avatar name={user.name} rawUrl={user.avatarUrl} variant="large" />

							<div className="min-w-0">
								<h3 className="truncate text-xl font-bold text-brand-text">{user.name}</h3>

								<p className="mt-0.5 truncate text-sm font-medium text-brand-muted">Bio...</p>
							</div>
						</div>

						{/* Account information */}
						<div className="mt-6 border-t border-stone-200 pt-5">
							<h3 className="text-sm font-bold text-brand-text">Account information</h3>

							<div className="mt-3 flex flex-col gap-3">
								{/* Name */}
								<div className="rounded-lg border border-stone-200 bg-white/70 px-4 py-3">
									<p className="text-xs font-bold uppercase tracking-wide text-brand-muted">Name</p>

									<p className="mt-1 text-sm font-medium text-brand-text">{user.name}</p>
								</div>

								{/* Email */}
								<div className="rounded-lg border border-stone-200 bg-white/70 px-4 py-3">
									<p className="text-xs font-bold uppercase tracking-wide text-brand-muted">Email</p>

									<p className="mt-1 text-sm font-medium text-brand-text">{user.email}</p>
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
