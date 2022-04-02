import './Groups.css';

import Header from '../header/Header.js';
import GroupAddDialog from './GroupAddDialog.js';
import GroupRemoveDialog from './GroupRemoveDialog.js';

import constants from '../core/Constants.js';

import React from 'react';
import axios from 'axios';

export default class Groups extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isAddingGroup: false,
			removing: {
				isShowingDialog: false,
				groupId: -1
			},
			groups: []
		};
	}

	getGroups() {
		axios.get(constants.restData.getGroups).then(response => {
			if (response.data.status == "success") {
				this.setState({groups: response.data.result});
			}
		});
	}

	componentDidMount() { this.getGroups(); }

	render() {
		const groupDivs = this.state.groups.map((group) => {
			return <div className="group_item">
				<p className="group_name">{group.name}</p>
				<div className="group_delete_button" onClick={() => {
					this.setState({
						removing: {
							isShowingDialog: true,
							groupId: group.id
						}
					});
				}}>
					<svg className="group_delete_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
				</div>
			</div>
		});

		let addingGroupView;
		if (this.state.isAddingGroup) {
			addingGroupView = <GroupAddDialog dismiss={() => {
				this.setState({isAddingGroup: false});
			}} update={() => {
				this.getGroups();
			}} />
		}

		let removingGroupView;
		if (this.state.removing.isShowingDialog) {
			removingGroupView = <GroupRemoveDialog dismiss={() => {
				this.setState({
					removing: {
						isShowingDialog: false,
						groupId: -1
					}
				});
			}} groupId={this.state.removing.groupId} update={() => {
				this.getGroups();
			}} />;
		}

		return <div>
			<Header onSearchChange={this.search} toggleSearch={this.toggleSearch} />
			<div className="group_toolbar_box">
				<h2 className="group_toolbar_title">Группы</h2>
				<div className="group_toolbar_buttons">
					<div className="core_button add_group_button" onClick={() => {
						this.setState({isAddingGroup: true});
					}}>Добавить группу</div>
				</div>
			</div>
			<div className="group_box">
				{groupDivs}
			</div>
			{addingGroupView}
			{removingGroupView}
		</div>
	}
}