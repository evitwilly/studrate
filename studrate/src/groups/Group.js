import './Group.css';

import StudentEditDialog from '../student/StudentEditDialog.js';
import StudentAddDialog from '../student/StudentAddDialog.js';
import constants from '../core/Constants.js';

import React from 'react';
import axios from 'axios';

const downloader = require('js-file-download');

export default class Group extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = { 
    		collapsed: true, 
    		editable: false, 
    		groupName: this.props.group.name,
    		studentAddingData: { isShowingDialog: false },
    		studentEditingData: {
    			isShowingDialog: false,
    			dialogCoordinateX: 0,
    			dialogCoordinateY: 0,
    			student: null
    		}
    	};
  	}

  	showStudentUpdateDialog(student) {
  		const data = {
  			isShowingDialog: true,
  			student: student
  		}
  		this.setState({studentAddingData: data});
  	}

  	showStudentAddDialog() {
  		const data = { isShowingDialog: true };
  		this.setState({studentAddingData: data});
  	}

  	dismissStudentAddDialog() {
  		const data = { isShowingDialog: false };
  		this.setState({studentAddingData: data});
  	}

  	showStudentEditingDialog(student, coordX, coordY) {
  		const data = {
  			isShowingDialog: true,
  			dialogCoordinateX: coordX,
  			dialogCoordinateY: coordY,
  			student: student
  		};
  		this.setState({studentEditingData: data})
  	}

  	dismissStudentEditingDialog() {
  		const data = {
  			isShowingDialog: false,
  			dialogCoordinateX: 0,
  			dialogCoordinateY: 0,
  			student: null
  		};
  		this.setState({studentEditingData: data});
  	}

  	expand() {
  		this.setState({ collapsed: false });
  	}

  	collapse() {
  		this.setState({ collapsed: true });
  	}

  	changeName() {
  		this.setState({ editable: true });
  	}

  	applyChangingName(groupName) {
  		if (groupName.length > 0) {
  			axios.post("http://localhost:3434/groups/updateName", { id: this.props.group.id, name: groupName }).then(response => {
				if (response.data["status"] == "success") {
					this.props.update();
					this.setState({editable: false});
				}
			});
  		}
  	}

  	makeSelfMurder() {
  		axios.post("http://localhost:3434/groups/remove", this.props.group).then(response => {
  			console.log(response.data);
			if (response.data["status"] == "success") {
				this.props.update();
			}
		});
  	}

	render() {
		const group = this.props.group;
		const students = this.props.students;	
		const studentKey = this.props.search;

		//const collapsed = this.state.collapsed || !(studentKey.length > 0 && students.length > 0);
		const collapsed = this.state.collapsed;

		let exportButton;
		let renderedStudents, collapsedButton;
		if (students != undefined && students.length > 0) {
			// if (collapsed) {
			// 	renderedStudents = <p className="total_students_title">всего студентов: {students.length}</p>
			// } else {
				
			// }


			exportButton = <div className="export_button noselect" onClick={() => {
				axios.post("http://localhost:3434/groups/export", {group: this.props.group, students: this.props.students}).then(response => {
					const link = document.createElement("a");
					link.href = response.data.result;
					link.style = "display: none";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				});
			}}>Экспортировать</div>;

			renderedStudents = students.map((student, index) => {

				const isVisible = studentKey.length <= 0 || student.fio.toLowerCase().indexOf(studentKey.toLowerCase()) != -1;

				let studentElement = <span />;

				if (isVisible) {

					const colorClass = index >= constants.studentCount ? " color_grey_300" : "";

					console.log("student class -> " + colorClass);

					studentElement = <div className="student" key={index.toString()} onClick={(event) => {
						this.showStudentEditingDialog(student, event.clientX, event.clientY);
					}} onDoubleClick={() => this.showStudentUpdateDialog(student)}>
						<p className={"student_name" + colorClass}>{index + 1}. {student.fio}</p>
						<p className={"student_rating" + colorClass}>{student.rating}</p>
					</div>;
				}


				return studentElement;
			});

			
			// if (this.state.collapsed) {
			// 	collapsedButton = <div className="group_button" onClick={this.expand.bind(this)}>
			// 		<svg className="group_button_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z"/></svg>
			// 	</div>;
			// } else {
			// 	collapsedButton = <div className="group_button" onClick={this.collapse.bind(this)}>
			// 		<svg className="group_button_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M374.6 246.6C368.4 252.9 360.2 256 352 256s-16.38-3.125-22.62-9.375L224 141.3V448c0 17.69-14.33 31.1-31.1 31.1S160 465.7 160 448V141.3L54.63 246.6c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160C387.1 213.9 387.1 234.1 374.6 246.6z"/></svg>
			// 	</div>;
			// }
		}
		
		let deleteButton;
		if (students == undefined || students.length <= 0) {
			deleteButton = (<div className="group_delete_button" onClick={this.makeSelfMurder.bind(this)}>
				<svg className="group_delete_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
			</div>);
		}

		let groupTitle;
		if (this.state.editable) {
			groupTitle = <input className="group_title_input" value={this.state.groupName} onChange={(input) => { this.setState({groupName: input.value}) }} onKeyPress={(event) => {
				if (event.key === 'Enter') {
					this.applyChangingName(event.target.value);
				}
			}} />;
		} else {
			groupTitle = <h4 className="group_title" onDoubleClick={() => this.changeName()}>{group.name}</h4>;
		}


		let studentEditDialog;
		if (this.state.studentEditingData.isShowingDialog) {
			const styles = {
				left: this.state.studentEditingData.dialogCoordinateX,
				top: this.state.studentEditingData.dialogCoordinateY
			};
			studentEditDialog = <StudentEditDialog update={this.props.update} 
				student={this.state.studentEditingData.student} styles={styles}
				dismiss={() => this.dismissStudentEditingDialog()} 
				edit={() => this.showStudentUpdateDialog(this.state.studentEditingData.student)} />;
		}

		let studentAddDialog;
		if (this.state.studentAddingData.isShowingDialog) {
			studentAddDialog = <StudentAddDialog group={group} student={this.state.studentAddingData.student}
				update={this.props.update} dismiss={() => this.dismissStudentAddDialog()} />;
		}

		return (
			<div className="group">
				{deleteButton}
				{groupTitle}
				<div className="group_buttons">
					<div className="group_text_button margin_right_8 noselect" onClick={() => {
						this.showStudentAddDialog();
					}}>Добавить<br />студента</div>
					{collapsedButton}
				</div>
				<div className="student_box">{renderedStudents}</div>
				{exportButton}
				{studentAddDialog}				
				{studentEditDialog}
			</div>
		);
	}
}
