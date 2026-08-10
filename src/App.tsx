import { ErrorPage } from "./pages/Error";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
	//setting default to login
	{
		path: "/",
		element: <LoginPage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},
	{
		path: "/*",
		element: <ErrorPage />,
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
