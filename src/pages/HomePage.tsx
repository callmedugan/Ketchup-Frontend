import { useEffect, useState } from "react";
import Button from "../components/Button";
import Logo from "../components/Logo";
import { useAuth } from "../contexts/AuthContext";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { getScheduleFromParsedJson, type Schedule } from "../utils/types";
import Calendar from "../components/Calendar";

export function HomePage() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { manualLogout, user, authFetch } = useAuth();

	/* ========================================================================= */
	//                        schedules
	/* ========================================================================= */

	const [schedules, setSchedules] = useState<Schedule[]>([]);
	// const addSchedule = (newSchedule: Schedule) => {
	// 	setSchedules((prevItems) => [...prevItems, newSchedule]);
	// };
	// const deleteSchedule = (idToDelete: string) => {
	// 	setSchedules((prevItems) => prevItems.filter((item) => item.id !== idToDelete));
	// };

	/* ========================================================================= */
	//                        useEffect when component mounts
	/* ========================================================================= */

	useEffect(() => {
		//console.log("Current user state:", user);
		if (!user) return;

		authFetch(`http://localhost:8080/api/schedules/${user?.id}`)
			.then((response) => {
				if (!response.ok) throw new Error("Could not connect to server");
				return response.json();
			})
			//success
			.then((data) => {
				//convert to array and assign to schedule state
				const scheduleData = getScheduleFromParsedJson(data);
				if (scheduleData == null) throw new Error("Schedule data invalid");
				setSchedules(scheduleData);
				setLoading(false);
			})
			//error
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [user]);

	/* ========================================================================= */
	//                        content
	/* ========================================================================= */

	return (
		<main className="min-h-screen bg-slate-200 px-6 py-8">
			<div className="mx-auto w-full max-w-7xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-300">
				<Logo />
				{getContent()}
			</div>
		</main>
	);

	function getContent() {
		//error
		if (error)
			return (
				<p role="alert" style={{ color: "crimson", margin: 0, textAlign: "center" }}>
					{error}
				</p>
			);
		//loading
		if (loading) return <LoadingIndicator variant="Loading" />;
		//default
		return (
			<>
				{/* greet user */}
				{user && (
					<div className="mb-8 text-center">
						<h1 className="text-2xl font-semibold text-gray-900">
							Hello, {user.name.split(" ")[0]}!
						</h1>
					</div>
				)}

				{/* show calendar */}
				<Calendar schedules={schedules} />

				<Button onClick={manualLogout}>Log Out</Button>
			</>
		);
	}
}
