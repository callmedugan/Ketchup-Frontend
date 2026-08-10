import type { ComponentProps } from "react";

type Variant = "default" | "email" | "password";

type InputFieldProps = {
	variant?: Variant;
} & ComponentProps<"label"> &
	ComponentProps<"input">;

export function InputField({ ...props }: InputFieldProps) {
	/* ========================================================================= */
	//                        email
	/* ========================================================================= */

	if (props.variant === "email") {
		return (
			<div>
				<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
					Email
				</label>

				<input
					id="email"
					type="email"
					className="w-full rounded-lg border border-gray-300 px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-red-400
                         focus:border-transparent"
					placeholder={props.placeholder ?? "you@example.com"}
				/>
			</div>
		);
	}
	/* ========================================================================= */
	//                        password
	/* ========================================================================= */

	if (props.variant === "password") {
		return (
			<div>
				<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
					Password
				</label>

				<input
					id="password"
					type="password"
					className="w-full rounded-lg border border-gray-300 px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-red-400
                         focus:border-transparent"
					placeholder={props.placeholder ?? "••••••••"}
				/>
			</div>
		);
	}
	/* ========================================================================= */
	//                        default
	/* ========================================================================= */
	return (
		<div>
			<label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-1">
				{props.children}
			</label>

			<input
				id="input"
				type="text"
				className="w-full rounded-lg border border-gray-300 px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-red-400
                         focus:border-transparent"
			/>
		</div>
	);
}
