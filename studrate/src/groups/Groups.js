import './Groups.css';

import Header from '../header/Header.js';
import Group from './Group.js';
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
			isEditingGroup: {
				isShowingDialog: false,
				group: null
			},
			removing: {
				isShowingDialog: false,
				groupId: -1
			},
			searchKey: "",
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
		const groupDivs = this.state.groups.filter((group) => {
			return group.name.toLowerCase().indexOf(this.state.searchKey.toLowerCase()) != -1;
		}).map((group) => {
			return <Group key={group.id.toString()} group={group} edit={() => this.setState({ isEditingGroup: {
				isShowingDialog: true, group: group
			} })} 
				update={() => this.getGroups()} showDialog={() => {
				this.setState({
					removing: {
						isShowingDialog: true,
						groupId: group.id
					}
				});
			}} />
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

		let editingGroupView;
		if (this.state.isEditingGroup.isShowingDialog) {
			editingGroupView = <GroupAddDialog group={this.state.isEditingGroup.group} dismiss={() => {
				this.setState({isEditingGroup: { isShowingDialog: false, group: null } });
			}} update={() => {
				this.getGroups();
			}} />
		}

		return <div>
			<Header onSearchChange={(text) => {
				this.setState({searchKey: text});
			}} isSearchToggling={false} />
			<div className="group_toolbar_box">
				<h2 className="group_toolbar_title">????????????</h2>
				<div className="group_toolbar_buttons">
					<div className="core_button add_group_button" onClick={() => {
						this.setState({isAddingGroup: true});
					}}>???????????????? ????????????</div>
				</div>
			</div>
			<div className="group_box">
				{groupDivs}
			</div>
			{addingGroupView}
			{removingGroupView}
			{editingGroupView}
		</div>
	}
}