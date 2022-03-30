import './App.css';

import React from 'react';

import Header from './header/Header.js';
import Groups from './groups/Groups.js';
import Test from './test/Test.js';
import ratedStudents from './core/Core.js';

import axios from 'axios';

export default class App extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = { 
    		groups: [], 
    		students: {}, 
    		isAddingGroup: false,
    		search: { type: "by_group", key: "" } 
    	};
    	this.update = this.update.bind(this);
    	this.cancelAddingGroup = this.cancelAddingGroup.bind(this);
    	this.updateSearchType = this.updateSearchType.bind(this);
    	this.search = this.search.bind(this);
	}

	cancelAddingGroup() {
		this.setState({isAddingGroup: false});
	}

	update() {
		axios.get("http://localhost:3434/groups").then(groupsResponse => {
			axios.get("http://localhost:3434/students").then(studentsResponse => {
				if (groupsResponse.data["status"] == "success" && studentsResponse.data["status"] == "success") {
					const groups = groupsResponse.data["result"];
					const students = ratedStudents(studentsResponse.data["result"]);
					console.log(students);
					this.setState({ groups: groups, students: students });
				}
			});
		});
	}

	updateSearchType(searchType) {
		const searchData = { type: searchType, key: this.state.search.key };
		this.setState({ search: searchData });
	}

	search(text) {
		const searchData = { type: this.state.search.type, key: text };
		this.setState({ search: searchData });
	}

	componentDidMount() { this.update(); }

	render() {

		return (
		    <div className="App">
		      <Header onChange={this.search} updateSearchType={this.updateSearchType} addGroup={() => {
		      	this.setState({isAddingGroup: true});
		      }} />
		      <Test update={this.update} />
		      <Groups groups={this.state.groups} 
		      	cancelAddingGroup={this.cancelAddingGroup}
		      	update={this.update}
		      	students={this.state.students} 
		      	search={this.state.search}
		      	isAddingGroup={this.state.isAddingGroup}
		      	 
		      />
		    </div>
  		);
	}

}
