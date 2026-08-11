import { useEffect, useState } from "react";
import Button from "../components/Button";
import Logo from "../components/Logo";
import { useAuth } from "../contexts/AuthContext";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { getScheduleFromParsedJson, type Schedule } from "../utils/types";
import ScheduleBlock from "../components/ScheduleBlock";

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
		<main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				<Logo />
				<p className="text-center block text-lg font-medium text-gray-700 mb-5">Home</p>

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
				<p className="block text-center text-sm font-medium text-gray-700 mb-1">
					{user && (
						<>
							<br />
							Hello, {user.name.split(" ")[0]}!
						</>
					)}
				</p>

				<ul className="my-5">
					{schedules.map((s) => (
						<ScheduleBlock key={s.id} schedule={s} />
					))}
				</ul>

				<Button onClick={manualLogout}>Log Out</Button>
			</>
		);
	}
}
