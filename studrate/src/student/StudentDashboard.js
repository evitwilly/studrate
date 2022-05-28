import './StudentDashboard.css';

import Header from '../header/Header.js';
import Toolbar from './Toolbar.js';
import StudentBox from './StudentBox.js';
import LoadingDialog from '../core/LoadingDialog.js';

import constants from '../core/Constants.js';

import axios from 'axios';
import React from 'react';

export default class StudentDashboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
    		groups: [], 
    		students: {}, 
    		isLoading: false,
    		isAddingGroup: false,
    		search: { type: "by_group", key: "" } 
    	};
    	this.update = this.update.bind(this);
    	this.toggleSearch = this.toggleSearch.bind(this);
    	this.search = this.search.bind(this);
	}

	update() {
		axios.get(constants.restData.getStudents).then(response => {
			if (response.data["status"] == "success") {
				const result = response.data["result"];
				this.setState({ groups: result.groups, students: result.students });
			}
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
			if (groupKey.length <= 0 || group.name.toLowerCase().indexOf(groupKey.toLowerCase()) != -1) {
				const items = this.state.students[group.id];
				groupDivs.push(<StudentBox group={group} groups={this.state.groups} search={studentKey} students={items} update={this.update} />);
			}
		});

		let loadingView;
		if (this.state.isLoading) {
			loadingView = <LoadingDialog title="Импортирование" content="Подождите пожалуйста, файл импортируется..." />
		}
		
		return <div>
			<Header onSearchChange={this.search} isSearchToggling={true} toggleSearch={this.toggleSearch} />
		    <Toolbar update={() => {
		    	this.update();
		    	this.setState({ isLoading: false });
		    }} onStartImporting={() => {
		    	this.setState({ isLoading: true });
		    }} onStatisticsImport={() => {
		    	axios.post(constants.restData.postStatisticsExport).then(response => {
	    			const link = document.createElement("a");
					link.href = response.data.result;
					link.style = "display: none";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
		    	});
		    }} />
		    <div className="group_container">{groupDivs}</div>;
		    {loadingView}
		</div>;
	}

	
};