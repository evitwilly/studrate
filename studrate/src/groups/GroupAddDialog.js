import './GroupAddDialog.css';

import React from 'react';
import axios from 'axios';
import constants from '../core/Constants.js';

export default class GroupAddDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			groupNameError: "",
			groupCountError: "",
			groupCount: this.props.group != null ? this.props.group.count : "25",
			groupName: this.props.group != null ? this.props.group.name : ""
		};
	}

	apply() {
		if (this.state.groupName.length <= 0) {
			this.setState({groupNameError: "Пустое название группы"})
		} else if (this.state.groupCount.length <= 0 || isNaN(parseInt(this.state.groupCount))) {
			this.setState({ 
				groupNameError: "",
				groupCountError: "Некорректное число"})
		} else {
			if (this.props.group != null) {
				axios.post(constants.restData.postGroupUpdate, { id: this.props.group.id, name: this.state.groupName, count: parseInt(this.state.groupCount) }).then(response => {
					this.props.update();
					this.props.dismiss()
				});
			} else {
				axios.post(constants.restData.postGroupAdd, { name: this.state.groupName, count: parseInt(this.state.groupCount) }).then(response => {
					this.props.update();
					this.props.dismiss()
				});
			}
		}
	}

	render() {
		let groupNameErrorView;
		if (this.state.groupNameError.length > 0) {
			groupNameErrorView = <p className="core_input_error">{this.state.groupNameError}</p>
		}
		let groupCountErrorView;
		if (this.state.groupCountError.length > 0) {
			groupCountErrorView = <p className="core_input_error">{this.state.groupCountError}</p>
		}

		return (
			<div className="core_container_dialog">
				<div className="core_dialog">
					<h4 className="core_dialog_title">Добавление группы
					<div className="core_dialog_close_button" onClick={() => this.props.dismiss()}>
						<svg className="core_dialog_close_button_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
					</div></h4>
					<p className="core_dialog_input_label">Максимальное кол-во заявлений:</p>
					<input className="core_dialog_input mb_16" value={this.state.groupCount}
						onChange={((event) => this.setState({groupCount: event.target.value}))} />
					{groupCountErrorView}
					<p className="core_dialog_input_label">Название группы:</p>
					<input className="core_dialog_input mb_16"
						value={this.state.groupName}
						onChange={((event) => this.setState({groupName: event.target.value}))}
					 placeholder="КСК-18" />
					{groupNameErrorView}
					<div className="core_dialog_apply_button" onClick={() => this.apply()}>{this.props.group != null ? "Изменить" : "Добавить"}</div>
				</div>
			</div>
		);
	}
}