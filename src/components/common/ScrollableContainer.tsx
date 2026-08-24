import { useEffect, useRef, useState, type ReactNode, type UIEvent } from "react";

type ScrollableContainerProps = {
	children: ReactNode;
	className?: string;
};

export default function ScrollableContainer({ children, className = "" }: ScrollableContainerProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	const [canScrollUp, setCanScrollUp] = useState(false);
	const [canScrollDown, setCanScrollDown] = useState(false);

	function updateScrollState(element: HTMLDivElement) {
		setCanScrollUp(element.scrollTop > 0);

		setCanScrollDown(element.scrollTop + element.clientHeight < element.scrollHeight - 1);
	}

	function handleScroll(event: UIEvent<HTMLDivElement>) {
		updateScrollState(event.currentTarget);
	}

	useEffect(() => {
		if (scrollRef.current) {
			updateScrollState(scrollRef.current);
		}
	}, [children]);

	return (
		<div className="relative min-h-0 flex-1 overflow-hidden">
			{/* Top fade */}
			{canScrollUp && (
				<div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex h-10 items-start justify-center bg-linear-to-b from-[#faf7f0] to-transparent pt-1">
					<svg
						viewBox="0 0 32 8"
						className="h-2 w-8 text-stone-400"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M2 6 L16 2 L30 6" />
					</svg>
				</div>
			)}

			{/* Scroll area */}
			<div
				ref={scrollRef}
				onScroll={handleScroll}
				className={`
					h-full overflow-y-auto pb-5
					scrollbar-none
					[&::-webkit-scrollbar]:hidden
					${className}
				`}
			>
				{children}
			</div>

			{/* Bottom fade */}
			{canScrollDown && (
				<div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex h-10 items-end justify-center bg-linear-to-t from-[#faf7f0] to-transparent pb-1">
					<svg
						viewBox="0 0 32 8"
						className="h-2 w-8 text-stone-400"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M2 2 L16 6 L30 2" />
					</svg>
				</div>
			)}
		</div>
	);
}
