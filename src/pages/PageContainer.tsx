import type { ReactNode } from "react";

type PageContainerProps = {
	children: ReactNode;
};

export default function PageContainer({ children }: PageContainerProps) {
	return (
		<main className="relative m-5 flex-1  overflow-visible rounded-3xl border border-stone-300/70 bg-[#f7f1e5] shadow-[0_10px_30px_rgba(60,30,15,0.18)] lg:m-7">
			{/* Push pins */}
			<PushPin className="left-5 top-5" />
			<PushPin className="right-5 top-5" />

			<div>{children}</div>
		</main>
	);
}

function PushPin({ className }: { className: string }) {
	return (
		<div
			className={`absolute z-20 h-3.5 w-3.5 rounded-full border border-[#7f2f29] bg-[#a63c32] shadow-[0_2px_3px_rgba(60,30,15,0.35)] ${className}`}
		>
			<div className="absolute left-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-white/30" />
		</div>
	);
}
