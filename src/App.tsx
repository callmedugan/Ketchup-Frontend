import { ErrorPage } from "./pages/Error";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
	//setting default to login
	{
		path: "/",
		element: <LoginPage />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
		errorElement: <ErrorPage />,
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
