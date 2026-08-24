import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import TestDataGenerator from "../testing/TestDataGenerator";

export default function NavBar() {
	const [isOpen, setIsOpen] = useState(false);

	const { logout } = useAuth();

	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 60_000);

		return () => clearInterval(interval);
	}, []);

	const navLinkClass = ({ isActive }: { isActive: boolean }) =>
		`rounded-lg px-3 py-2 text-sm font-semibold transition ${
			isActive ? "bg-[#f3d6d1] text-brand-red shadow-sm" : "text-brand-text hover:bg-[#f7eadb] hover:text-brand-red"
		}`;

	return (
		<>
			{/* Desktop Sidebar */}
			<nav className="hidden min-h-screen w-56 shrink-0 border-r border-[#d8c5ad] bg-[#f6eddf] px-4 py-6 shadow-[4px_0_12px_rgba(80,50,30,0.08)] md:block">
				<div className="flex h-full flex-col">
					{/* Logo card */}
					<div className="relative mb-4 rotate-1 rounded-sm border border-[#ddc9aa] bg-[#fffaf0] px-4 pb-3 pt-5 shadow-[2px_3px_6px_rgba(80,50,30,0.12)]">
						{/* Push pin */}
						<div className="absolute left-1/2 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#a63c32] shadow-sm" />

						<Logo showTagLine={false} size="nav" />
					</div>

					{/* Current date / time */}
					<div className="mb-8 px-2 text-center">
						<div className="text-lg font-bold text-brand-text">{format(currentTime, "h:mm a")}</div>

						<div className="mt-0.5 text-xs font-medium text-brand-muted">{format(currentTime, "EEEE, MMM d")}</div>
					</div>

					{/* Navigation */}
					<nav className="flex flex-col gap-1.5 ">
						<NavLink to="/calendar" className={navLinkClass}>
							Calendar
						</NavLink>

						<NavLink to="/friends" className={navLinkClass}>
							Friends
						</NavLink>

						<NavLink to="/profile" className={navLinkClass}>
							Profile
						</NavLink>

						<NavLink to="/plans" className={navLinkClass}>
							Plans
						</NavLink>
					</nav>

					<div className="mt-auto">
						<TestDataGenerator />
						{/* Account actions */}
						<div className="border-t border-[#d8c5ad] pt-3">
							<button
								type="button"
								onClick={logout}
								className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#7a6a5f] transition hover:bg-[#f7eadb] hover:text-brand-red"
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

			{/* Mobile Navbar */}
			<nav className="border-b border-[#d8c5ad] bg-[#f6eddf] text-brand-text shadow-[0_3px_10px_rgba(80,50,30,0.08)] md:hidden">
				<div className="flex h-16 items-center justify-between px-4">
					<div className="relative rotate-1 rounded-sm border border-[#ddc9aa] bg-[#fffaf0] px-3 py-1.5 shadow-sm">
						<div className="absolute left-1/2 top-0.5 h-2 w-2 -translate-x-1/2 rounded-full bg-[#a63c32]" />

						<Logo showTagLine={false} />
					</div>

					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						className="rounded-lg p-2 text-brand-text transition hover:bg-[#f7eadb] hover:text-brand-red"
						aria-label="Toggle navigation"
						aria-expanded={isOpen}
					>
						{isOpen ? (
							<svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M6 6l12 12M18 6L6 18" />
							</svg>
						) : (
							<svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						)}
					</button>
				</div>

				{/* Mobile menu */}
				{isOpen && (
					<div className="border-t border-[#d8c5ad] px-4 py-3">
						<nav className="flex flex-col gap-1.5">
							<NavLink to="/calendar" className={navLinkClass} onClick={() => setIsOpen(false)}>
								Calendar
							</NavLink>

							<NavLink to="/friends" className={navLinkClass} onClick={() => setIsOpen(false)}>
								Friends
							</NavLink>

							<NavLink to="/profile" className={navLinkClass} onClick={() => setIsOpen(false)}>
								Profile
							</NavLink>

							<NavLink to="/plans" className={navLinkClass} onClick={() => setIsOpen(false)}>
								Plans
							</NavLink>
						</nav>

						<div className="mt-3 border-t border-[#d8c5ad] pt-3">
							<button
								type="button"
								onClick={logout}
								className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#7a6a5f] transition hover:bg-[#f7eadb] hover:text-brand-red"
							>
								Log out
							</button>
						</div>

						<div className="mt-4 px-2 text-xs text-brand-muted">
							<p>
								Powered by
								<br />
								React · TypeScript · Node.js
							</p>
						</div>
					</div>
				)}
			</nav>
		</>
	);
}
