import type { ReactNode } from "react";
import NavBar from "../components/NavBar";

type PageContainerProps = {
	title: string;
	description: string;
	children: ReactNode;
};

export default function PageContainer({ title, description, children }: PageContainerProps) {
	return (
		<div className="flex h-screen overflow-hidden bg-brand-cork bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12)_0_1px,transparent_1px),radial-gradient(circle_at_80%_70%,rgba(80,40,20,0.12)_0_1px,transparent_1px)] bg-size-[11px_11px,17px_17px]">
			<NavBar />

			<main className="relative m-5 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-stone-300/70 bg-brand-page shadow-[0_10px_30px_rgba(60,30,15,0.18)] lg:m-7">
				<PushPin className="left-5 top-5" />
				<PushPin className="right-5 top-5" />

				{/* Page content */}
				<div className="flex min-h-0 flex-1 flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
					{/* Header */}
					<div className="mb-5 ml-2 shrink-0">
						<h1 className="text-3xl font-bold tracking-tight text-brand-text">{title}</h1>
						<p className="mt-1 text-xs font-medium text-brand-muted">{description}</p>
					</div>

					{/* Content */}
					<div className="flex min-h-0 flex-1 flex-col">{children}</div>
				</div>
			</main>
		</div>
	);
}

function PushPin({ className }: { className: string }) {
	return (
		<div
			className={`absolute z-20 h-3.5 w-3.5 rounded-full border border-brand-red-dark bg-[#a63c32] shadow-[0_2px_3px_rgba(60,30,15,0.35)] ${className}`}
		>
			<div className="absolute left-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-white/30" />
		</div>
	);
}
