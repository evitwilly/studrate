import './StudentDashboard.css';

import Header from '../header/Header.js';
import Toolbar from './Toolbar.js';
import StudentBox from './StudentBox.js';

import constants from '../core/Constants.js';
import ratedStudents from '../core/Core.js';

import axios from 'axios';
import React from 'react';

export default class StudentDashboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
    		groups: [], 
    		students: {}, 
    		isAddingGroup: false,
    		search: { type: "by_group", key: "" } 
    	};
    	this.update = this.update.bind(this);
    	this.toggleSearch = this.toggleSearch.bind(this);
    	this.search = this.search.bind(this);
	}

	update() {
		axios.get(constants.restData.getGroups).then(groupsResponse => {
			axios.get(constants.restData.getStudents).then(studentsResponse => {
				if (groupsResponse.data["status"] == "success" && studentsResponse.data["status"] == "success") {
					const groups = groupsResponse.data["result"];
					const students = ratedStudents(studentsResponse.data["result"]);
					this.setState({ groups: groups, students: students });
				}
			});
		});
	}

	toggleSearch(searchType) {
		const searchData = { type: searchType, key: this.state.search.key };
		this.setState({ search: searchData });
	}

	search(text) {
		const searchData = { type: this.state.search.type, key: text };
		this.setState({ search: searchData });
	}

	componentDidMount() { this.update(); }

	render() {
		const groups = this.props.groups;
		const searchType = this.state.search.type;

		let groupKey = "";
		let studentKey = "";
		if (searchType == "by_group") {
			groupKey = this.state.search.key;
		} else {
			studentKey = this.state.search.key;
		}

		const groupDivs = [];
		this.state.groups.forEach((group) => {
			if (groupKey.length <= 0 || group.name.indexOf(groupKey) != -1) {
				const items = this.state.students[group.id];
				groupDivs.push(<StudentBox group={group} search={studentKey} students={items} update={this.update} />);
			}
		});
		
		return <div>
			<Header onSearchChange={this.search} toggleSearch={this.toggleSearch} />
		    <Toolbar update={this.update} />
		    <div className="group_container">{groupDivs}</div>;
		</div>;
	}

	
};