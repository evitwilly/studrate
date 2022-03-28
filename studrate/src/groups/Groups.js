import './Groups.css';

import Group from './Group.js';
import EmptyGroup from './EmptyGroup.js';

import React from 'react';

export default class Groups extends React.Component {


	constructor(props) {
		super(props);
	}

	render() {
		const groups = this.props.groups;
		const studentsByGroup = this.props.students;
		const updateFunction = this.props.update;
		const searchType = this.props.search.type;

		let groupKey = "";
		let studentKey = "";
		if (searchType == "by_group") {
			groupKey = this.props.search.key;
		} else {
			studentKey = this.props.search.key;
		}

		const groupDivs = [];
		groups.forEach((group) => {
			if (groupKey.length <= 0 || group.name.indexOf(groupKey) != -1) {
				const students = studentsByGroup[group.id];
				groupDivs.push(<Group group={group} search={studentKey} students={students} update={updateFunction} />);
			}
		});
		if (this.props.isAddingGroup) {
			groupDivs.push(<EmptyGroup update={updateFunction} cancelAddingGroup={() => {
				this.props.cancelAddingGroup();
			}} />);
		}
		

		return <div className="group_container">{groupDivs}</div>;
	}

	
};