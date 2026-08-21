import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoadingIndicator } from "../components/LoadingIndicator";
import Profile from "../components/Profile";
import PageContainer from "./PageContainer";

export function ProfilePage() {
	const [loading] = useState(false);
	const [error] = useState<string | null>(null);

	const { user } = useAuth();

	/* ========================================================================= */
	//                        page
	/* ========================================================================= */

	return <PageContainer>{getContent()}</PageContainer>;

	function getContent() {
		/* --------------------------------------------------------------------- */
		// Error
		/* --------------------------------------------------------------------- */

		if (error) {
			return (
				<div className="flex min-h-96 items-center justify-center px-6">
					<div className="text-center">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">!</div>

						<h2 className="mt-4 text-lg font-bold text-stone-900">Something went wrong</h2>

						<p role="alert" className="mt-2 text-sm text-red-600">
							{error}
						</p>
					</div>
				</div>
			);
		}

		/* --------------------------------------------------------------------- */
		// Loading
		/* --------------------------------------------------------------------- */

		if (loading) {
			return (
				<div className="flex min-h-96 items-center justify-center">
					<LoadingIndicator variant="Loading" />
				</div>
			);
		}

		/* --------------------------------------------------------------------- */
		// Default
		/* --------------------------------------------------------------------- */

		return (
			<div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
				{/* Page heading */}
				<div className="mb-7 shrink-0">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">Your profile</p>

					{user && <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-text">Hello, {user.name.split(" ")[0]}!</h1>}

					<p className="mt-1 text-sm font-medium text-brand-muted">Tell your friends a little bit about yourself.</p>
				</div>

				{/* Profile */}
				<div className="mx-auto max-w-3xl">{/* Profile content goes here */}</div>
				<Profile user={user!} />
			</div>
		);
	}
}
