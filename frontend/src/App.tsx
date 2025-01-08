import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		// Check if user is authenticated (e.g., check for valid token in localStorage)
		const token = localStorage.getItem("token");
		setIsAuthenticated(!!token);
	}, []);

	return (
		<Router>
			<Routes>
				<Route
					path='/login'
					element={isAuthenticated ? <Navigate to='/dashboard' /> : <Login setIsAuthenticated={setIsAuthenticated} />}
				/>
				<Route
					path='/dashboard'
					element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to='/login' />}
				/>
				<Route path='/' element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
			</Routes>
		</Router>
	);
}

export default App;
