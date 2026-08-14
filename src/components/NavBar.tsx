import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function NavBar() {
	return (
		<nav className="min-h-screen w-56 shrink-0 border-r border-stone-900/30 bg-[#292522] px-4 py-6 text-stone-100 shadow-[4px_0_15px_rgba(40,20,10,0.15)]">
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
					<Link
						to="/"
						className="rounded-xl bg-[#f7f1e5]/10 px-4 py-3 text-sm font-semibold text-[#f7f1e5] transition hover:bg-[#f7f1e5]/15"
					>
						Calendar
					</Link>

					<Link
						to="/"
						className="rounded-xl px-4 py-3 text-sm font-medium text-stone-400 transition hover:bg-[#f7f1e5]/10 hover:text-[#f7f1e5]"
					>
						Friends
					</Link>

					<Link
						to="/"
						className="rounded-xl px-4 py-3 text-sm font-medium text-stone-400 transition hover:bg-[#f7f1e5]/10 hover:text-[#f7f1e5]"
					>
						Profile
					</Link>
				</nav>

				{/* ========================================================= */}
				{/* Bottom branding */}
				{/* ========================================================= */}

				<div className="mt-auto px-2 text-xs text-stone-500">
					<p>Ketchup</p>

					<p className="mt-1">The secret sauce to making plans.</p>
				</div>
			</div>
		</nav>
	);
}
