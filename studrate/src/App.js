import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';

import StudentDashboard from './student/StudentDashboard.js';
import Professions from './professions/Professions.js';
import Groups from './groups/Groups.js';

export default class App extends React.Component {

	render() {
		return (<BrowserRouter>
		 	<Routes>
				<Route path="/" element={<StudentDashboard />} />
				<Route path="/groups" element={<Groups />} />
				<Route path="/professions" element={<Professions />} />
			</Routes>
    	</BrowserRouter>);
	}

}
