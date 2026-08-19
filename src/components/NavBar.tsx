import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
	const [isOpen, setIsOpen] = useState(false);

	const { logout } = useAuth();

	const navLinkClass = ({ isActive }: { isActive: boolean }) =>
		`rounded-lg px-3 py-2 text-sm font-semibold transition ${
			isActive ? "bg-[#f3d6d1] text-[#a63c32]" : "text-stone-200 hover:bg-white/10 hover:text-white"
		}`;

	return (
		<>
			{/* Desktop Sidebar */}
			<nav className="hidden min-h-screen w-56 shrink-0 border-r border-[#4a4038] bg-[#463b33] px-4 py-6 text-stone-100 shadow-[4px_0_15px_rgba(40,20,10,0.15)] md:block">
				<div className="flex h-full flex-col">
					{/* Logo */}
					<div className="mb-10 px-2">
						<Logo showTagLine={false} />
					</div>

					{/* Navigation */}
					<nav className="flex flex-col gap-1.5">
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
						{/* Account actions */}
						<div className="border-t border-[#5a4d43] pt-3">
							<button
								type="button"
								onClick={logout}
								className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-stone-300 transition hover:bg-white/10 hover:text-white"
							>
								Log out
							</button>
						</div>

						{/* Branding */}
						<div className="mt-4 px-2 text-xs text-stone-400">
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
			<nav className="border-b border-[#4a4038] bg-[#463b33] text-stone-100 shadow-[0_3px_10px_rgba(40,20,10,0.15)] md:hidden">
				<div className="flex h-16 items-center justify-between px-4">
					<Logo showTagLine={false} />

					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						className="rounded-lg p-2 text-stone-200 transition hover:bg-white/10 hover:text-white"
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
					<div className="border-t border-[#5a4d43] px-4 py-3">
						<nav className="flex flex-col gap-1.5">
							<NavLink to="/home" className={navLinkClass} onClick={() => setIsOpen(false)}>
								Home
							</NavLink>

							<NavLink to="/friends" className={navLinkClass} onClick={() => setIsOpen(false)}>
								Friends
							</NavLink>

							<NavLink to="/profile" className={navLinkClass} onClick={() => setIsOpen(false)}>
								Profile
							</NavLink>
						</nav>

						<div className="mt-auto">
							{/* Account actions */}
							<div className="border-t border-[#5a4d43] pt-3">
								<button
									type="button"
									onClick={logout}
									className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-stone-300 transition hover:bg-white/10 hover:text-white"
								>
									Log out
								</button>
							</div>

							{/* Branding */}
							<div className="mt-4 px-2 text-xs text-stone-400">
								<p>
									Powered by
									<br />
									React · TypeScript · Node.js
								</p>
							</div>
						</div>
					</div>
				)}
			</nav>
		</>
	);
}
