import { NavLink } from "react-router-dom";
import Logo from "./Logo";

export default function NavBar() {
	return (
		<nav className="min-h-screen w-56 shrink-0 border-r border-[#4a4038] bg-[#463b33] px-4 py-6 text-stone-100 shadow-[4px_0_15px_rgba(40,20,10,0.15)]">
			<div className="flex h-full flex-col">
				{/* ========================================================= */}
				{/* Logo */}
				{/* ========================================================= */}

				<div className="mb-10 px-2">
					<Logo showTagLine={false} />
				</div>

				{/* ========================================================= */}
				{/* Navigation */}
				{/* ========================================================= */}

				<nav className="flex flex-col gap-1.5">
					<NavLink
						to="/home"
						className={({ isActive }) =>
							`rounded-lg px-3 py-2 text-sm font-semibold transition ${
								isActive
									? "bg-[#f3d6d1] text-[#a63c32]"
									: "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
							}`
						}
					>
						Home
					</NavLink>

					<NavLink
						to="/friends"
						className={({ isActive }) =>
							`rounded-lg px-3 py-2 text-sm font-semibold transition ${
								isActive
									? "bg-[#f3d6d1] text-[#a63c32]"
									: "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
							}`
						}
					>
						Friends
					</NavLink>

					<NavLink
						to="/"
						className={({ isActive }) =>
							`rounded-lg px-3 py-2 text-sm font-semibold transition ${
								isActive
									? "bg-[#f3d6d1] text-[#a63c32]"
									: "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
							}`
						}
					>
						Profile
					</NavLink>
				</nav>

				{/* ========================================================= */}
				{/* Bottom branding */}
				{/* ========================================================= */}

				<div className="mt-auto px-2 text-xs text-stone-500">
					<p className="mt-1">
						Powered by
						<br />
						React · TypeScript · Node.js
					</p>
				</div>
			</div>
		</nav>
	);
}
