import './StudentEditDialog.css';

import constants from '../core/Constants.js';

import GroupSelectDialog from './GroupSelectDialog.js';

import React from 'react';
import axios from 'axios';

export default class StudentEditDialog extends React.Component {

	constructor(props) {
		super(props);

		const studentData = this.props.student;

		const fioData = studentData != undefined ?
			{
				status: "success",
				message: "",
				data: studentData.fio,
			} :
			{
				status: "empty",
				message: ""
			};

		const ratingData = studentData != undefined ?
			{
				status: "success",
				message: "",
				data: studentData.rating
			} :
			{
				status: "empty",
				message: ""
			};

		const priorityData = studentData != undefined ?
			{
				priorityOne: studentData.priorityOne, 
				priorityTwo: studentData.priorityTwo, 
				priorityThree: studentData.priorityThree,
				prioritySelecting: -1
			} :
			{
				priorityOne: this.props.group.id, 
				priorityTwo: -1, 
				priorityThree: -1,
				prioritySelecting: -1
			}

		this.state = { 
			isGroupChoosing: false, 
			groups: [],
			priorityError: "",
			priorityData: priorityData,
			fioData: fioData,
			ratingData: ratingData
		};
	}

	changeFio(fio) {
		const data = {
			status: this.state.fioData.status,
			message: this.state.fioData.message,
			data: fio
		};
		this.setState({
			fioData: data
		});
	}

	changeRating(rating) {
		const data = {
			status: this.state.ratingData.status,
			message: this.state.ratingData.message,
			data: rating
		};
		this.setState({ ratingData: data });
	}	

	componentDidMount() {
		axios.get(constants.restData.getGroups).then((response) => {
			if (response.data["status"] == "success") {
				this.setState({ groups: response.data["result"] });
			}
		});
	}

	updatePriorityOne(groupId) {
		const data = {
			priorityOne: groupId,
			priorityTwo: this.state.priorityData.priorityTwo,
			priorityThree: this.state.priorityData.priorityThree,
			prioritySelecting: -1
		};
		this.setState({ isGroupChoosing: false, priorityData: data });
	}

	updatePriorityTwo(groupId) {
		const data = {
			priorityOne: this.state.priorityData.priorityOne,
			priorityTwo: groupId,
			priorityThree: this.state.priorityData.priorityThree,
			prioritySelecting: -1
		};
		this.setState({ isGroupChoosing: false, priorityData: data });
	}

	updatePriorityThree(groupId) {
		const data = {
			priorityOne: this.state.priorityData.priorityOne,
			priorityTwo: this.state.priorityData.priorityTwo,
			priorityThree: groupId,
			prioritySelecting: -1
		};
		this.setState({ isGroupChoosing: false, priorityData: data });
	}

	apply() {
		const fio = this.fio.value;

		let fioData = {};
		if (fio.length <= 0) {
			fioData.status = "error";
			fioData.message = "вы не указали ФИО студента";
			fioData.data = "";
		} else {
			fioData.status = "success";
			fioData.message = "";
			fioData.data = fio;
		}

		const rating = this.rating.value;
		
		let ratingData = {};
		if (rating.length <= 0) {
			ratingData.status = "error";
			ratingData.message = "вы не указали балл студента";
			ratingData.data = "";
		} else {
			const ratingNumber = parseFloat(rating);
			if (isNaN(ratingNumber)) {
				ratingData.status = "error";
				ratingData.message = "балл студента был некорректно указан";
			} else {
				ratingData.status = "success";
				ratingData.message = "";
				ratingData.data = rating;
			}
		}

		let priorityError = "";
		if (this.state.priorityData.priorityOne == -1) {
			priorityError = "вы не выбрали ни одну из групп";
		}

		if (fioData.status == "success" && ratingData.status == "success" && priorityError.length <= 0) {
			const priorityData = this.state.priorityData;
			const data = {
				"fio": fioData.data,
				"rating": ratingData.data,
				"priority_one": priorityData.priorityOne,
				"priority_two": priorityData.priorityTwo,
				"priority_three": priorityData.priorityThree
			};

			if (this.props.student != undefined) {
				data["id"] = this.props.student.id;
				axios.post(constants.restData.postStudentUpdate, data).then(response => {
					console.log(response.data);
					if (response.data.status == "success") {
						this.props.dismiss();
						this.props.update();
					}
				});
			} else {
				axios.post(constants.restData.postStudentAdd, data).then(response => {
					if (response.data.status == "success") {
						this.props.dismiss();
						this.props.update();
					}
				});
			}

			
			
		} else {
			this.setState({
				fioData: fioData,
				ratingData: ratingData,
				priorityError: priorityError
			});
		}
	}

	showGroupSelectDialog(priority) {
		const data = {
			priorityOne: this.state.priorityData.priorityOne,
			priorityTwo: this.state.priorityData.priorityTwo,
			priorityThree: this.state.priorityData.priorityThree,
			prioritySelecting: priority
		};
		this.setState({isGroupChoosing: true, priorityData: data});
	}

	dismissGroupSelectDialog() {
		this.setState({isGroupChoosing: false});
	}

	render() {

		const groups = this.state.groups;

		let groupDialog;
		if (this.state.isGroupChoosing) {
			groupDialog = <GroupSelectDialog groups={groups} update={(groupId) => {
				const priority = this.state.priorityData.prioritySelecting;
				if (priority == 1) {
					this.updatePriorityOne(groupId);
				} else if (priority == 2) {
					this.updatePriorityTwo(groupId);
				} else {
					this.updatePriorityThree(groupId);
				}
			}} dismiss={() => this.dismissGroupSelectDialog()} />;
		}

		let group1 = "не выбрано";
		let group2 = "не выбрано";
		let group3 = "не выбрано";

		const priorityOne = this.state.priorityData.priorityOne;
		const priorityTwo = this.state.priorityData.priorityTwo;
		const priorityThree = this.state.priorityData.priorityThree;

		groups.forEach((group) => {
			if (group.id == priorityOne) {
				group1 = group.name;
			} else if (group.id == priorityTwo) {
				group2 = group.name;
			} else if (group.id == priorityThree) {
				group3 = group.name;
			}
		});

		let fioError;
		if (this.state.fioData.status == "error") {
			fioError = <p className="core_input_error">{this.state.fioData.message}</p>;
		}

		let ratingError;
		if (this.state.ratingData.status == "error") {
			ratingError = <p className="core_input_error">{this.state.ratingData.message}</p>;
		}

		let priorityError;
		if (this.state.priorityError.length > 0) {
			priorityError = <p className="core_input_error">{this.state.priorityError}</p>;
		}

		const buttonText = this.props.student != undefined ? "Изменить" : "Добавить";
		const titleText = this.props.student != undefined ? "Редактирование студента" : "Добавление студента";

		return (
			<div className="core_container_dialog">
				<div className="core_dialog">
					<h4 className="core_dialog_title">{titleText}<div className="core_dialog_close_button" onClick={this.props.dismiss}>
						<svg className="core_dialog_close_button_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
					</div></h4>
					<input className="core_dialog_input" 
						value={this.state.fioData.data}
						onChange={(event) => {
							this.changeFio(event.target.value)
						}}
						ref={(input) => this.fio = input}  placeholder="ФИО студента" />
					{fioError}
					<input className="core_dialog_input" 
						value={this.state.ratingData.data}
						onChange={(event) => {
							this.changeRating(event.target.value)
						}}
						ref={(input) => this.rating = input} placeholder="4.5" />
					{ratingError}
					<p className="group_priority_text">Первая группа: <span className="group_priority_element" onClick={() => {
						this.showGroupSelectDialog(1);
					}}>{group1}</span></p>
					<p className="group_priority_text">Вторая группа: <span className="group_priority_element" onClick={() => {
						this.showGroupSelectDialog(2);
					}}>{group2}</span></p>
					<p className="group_priority_text">Третья группа: <span className="group_priority_element" onClick={() => {
						this.showGroupSelectDialog(3);
					}}>{group3}</span></p>
					{priorityError}
					<div className="core_dialog_apply_button" onClick={() => this.apply()}>{buttonText}</div>
				</div>
				{groupDialog}
			</div>
		);
	}
}