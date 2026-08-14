type LogoProps = {
	showTagLine: boolean;
	variant?: "light" | "dark";
};

export default function Logo({ showTagLine, variant = "light" }: LogoProps) {
	const isDark = variant === "dark";

	return (
		<div className="mb-10 text-center">
			<h1
				className={`font-black tracking-tight ${
					isDark ? "text-4xl text-[#fff3d6]" : "text-5xl text-red-600"
				}`}
			>
				Ketchup
			</h1>

			{/* Brand accent */}
			<div
				className={`mx-auto mt-2 h-1 w-12 rounded-full ${isDark ? "bg-[#d94b3d]" : "bg-red-500"}`}
			/>

			{/* only show on main pages */}
			{showTagLine && (
				<p className={`mt-3 text-sm ${isDark ? "text-[#cbbdb3]" : "text-gray-500"}`}>
					The secret sauce to making plans
				</p>
			)}
		</div>
	);
}
