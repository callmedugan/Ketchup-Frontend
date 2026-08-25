import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import { usePlans } from "../contexts/PlansContext";
import { useFriends } from "../contexts/FriendsContext";

export default function NavBar() {
	const { logout } = useAuth();
	const { plansNotificationCount } = usePlans();
	const { friendsNotificationCount } = useFriends();

	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 60_000);

		return () => clearInterval(interval);
	}, []);

	const navLinkClass = ({ isActive }: { isActive: boolean }) =>
		`rounded-lg px-3 py-2 text-sm font-semibold transition ${
			isActive ? "bg-brand-pink text-brand-red shadow-sm" : "text-brand-text hover:bg-brand-card hover:text-brand-red"
		}`;

	return (
		<>
			{/* Desktop Sidebar */}
			<nav className="hidden min-h-screen w-56 shrink-0 border-r border-brand-cream bg-[#f6eddf] px-4 py-6 shadow-xl md:block">
				<div className="flex h-full flex-col">
					{/* Logo card */}
					<div className="relative mb-4 rotate-1 rounded-sm border border-[#ddc9aa] bg-[#fffaf0] px-4 pb-3 pt-5 shadow-xl">
						{/* Push pin */}
						<div className="absolute left-1/2 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-brand-red-dark" />

						<Logo showTagLine={false} size="nav" />
					</div>

					{/* Current date / time */}
					<div className="mb-8 px-2 text-center">
						<div className="text-lg font-bold text-brand-text">{format(currentTime, "h:mm a")}</div>
						<div className="text-xs font-medium text-brand-muted">{format(currentTime, "EEEE, MMM d")}</div>
					</div>

					{/* Navigation */}
					<nav className="flex flex-col gap-1.5 ">
						<NavLink to="/calendar" className={navLinkClass}>
							Calendar
						</NavLink>

						<NavLink to="/plans" className={navLinkClass}>
							<div className="flex items-center">
								<span>Plans</span>
								{showNotificationCount(plansNotificationCount)}
							</div>
						</NavLink>

						<NavLink to="/friends" className={navLinkClass}>
							<div className="flex items-center">
								<span>Friends</span>
								{showNotificationCount(friendsNotificationCount)}
							</div>
						</NavLink>

						<NavLink to="/profile" className={navLinkClass}>
							Profile
						</NavLink>
					</nav>

					<div className="mt-auto">
						{/* Account actions */}
						<div className="border-t border-brand-muted/35 pt-2">
							<button
								type="button"
								onClick={logout}
								className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-brand-muted transition hover:bg-brand-card hover:text-brand-red"
							>
								Log out
							</button>
						</div>

						{/* Branding */}
						<div className="mt-4 px-2 text-xs text-brand-muted">
							<p>
								Powered by
								<br />
								React · TypeScript · Node.js
							</p>
						</div>
					</div>
				</div>
			</nav>
		</>
	);

	function showNotificationCount(count: number) {
		if (count === 0) return null;
		return (
			<span className="ml-auto flex min-w-5 items-center justify-center rounded-full bg-brand-red px-2 py-1.25 text-[10px] font-bold leading-none text-white">
				{count > 9 ? "9+" : count}
			</span>
		);
	}
}
