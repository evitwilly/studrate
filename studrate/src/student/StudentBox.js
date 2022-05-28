import './StudentBox.css';

import StudentPopupDialog from './StudentPopupDialog.js';
import StudentRemoveDialog from './StudentRemoveDialog.js';
import StudentEditDialog from './StudentEditDialog.js';
import StudentExportDialog from './StudentExportDialog.js';

import constants from '../core/Constants.js';

import React from 'react';
import axios from 'axios';

export default class StudentBox extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = { 
    		collapsed: true, 
    		editable: false, 
    		groupName: this.props.group.name,
    		studentRemovingData: {
    			isShowingDialog: false,
    			studentId: -1
    		},
    		studentExportingData: { isShowingDialog: false },
    		studentAddingData: { isShowingDialog: false },
    		studentPopupData: {
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

  	showStudentEditDialog() {
  		const data = { isShowingDialog: true };
  		this.setState({studentAddingData: data});
  	}

  	dismissStudentEditDialog() {
  		const data = { isShowingDialog: false };
  		this.setState({studentAddingData: data});
  	}

  	showStuudentPopupDialog(student, coordX, coordY) {
  		const data = {
  			isShowingDialog: true,
  			dialogCoordinateX: coordX,
  			dialogCoordinateY: coordY,
  			student: student
  		};
  		this.setState({studentPopupData: data})
  	}

  	dismissStudentPopupDialog() {
  		this.setState({
  			studentPopupData: {
	  			isShowingDialog: false,
	  			dialogCoordinateX: 0,
	  			dialogCoordinateY: 0,
	  			student: null
  			}
  		});
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

  	showStudentRemoveDialog() {
  		this.setState({
			studentRemovingData: {
				isShowingDialog: true,
				studentId: this.state.studentPopupData.student.id
			},
			studentPopupData: {
				isShowingDialog: false,
				dialogCoordinateX: 0,
  				dialogCoordinateY: 0,
  				student: null
			}
		});
  	}

  	dismissStudentRemoveDialog() {
  		this.setState({
  			studentRemovingData: {
  				isShowingDialog: false,
  				studentId: -1
  			}
  		});
  	}

	render() {
		const group = this.props.group;
		const students = this.props.students;	
		const studentKey = this.props.search;

		let exportButton, expandButton;
		let renderedStudents, collapsedButton;
		if (students != undefined && students.length > 0) {

			exportButton = <div className="export_button noselect" onClick={() => {
				this.setState({
					studentExportingData: {
						isShowingDialog: true
					}
				});
			}}>Экспорт в Excel файл</div>;

			const isVisibleExpandButton = studentKey.length <= 0 && students.length > 5;
			const isCollapsed = this.state.collapsed;
			if (isVisibleExpandButton) {
				if (isCollapsed) {
					expandButton = <div className="collapsed_button" onClick={() => {
						this.setState({ collapsed: false });
					}}><svg className="collapsed_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z"/></svg></div>;
				} else {
					expandButton = <div className="collapsed_button" onClick={() => {
						this.setState({ collapsed: true });
					}}><svg className="collapsed_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M374.6 246.6C368.4 252.9 360.2 256 352 256s-16.38-3.125-22.62-9.375L224 141.3V448c0 17.69-14.33 31.1-31.1 31.1S160 465.7 160 448V141.3L54.63 246.6c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160C387.1 213.9 387.1 234.1 374.6 246.6z"/></svg></div>;
				}
			}

			const end = isCollapsed && isVisibleExpandButton ? 5 : students.length;

			renderedStudents = students.slice(0, end).map((student, index) => {

				const isVisible = studentKey.length <= 0 || student.fio.toLowerCase().indexOf(studentKey.toLowerCase()) != -1;

				let studentElement = <span />;

				if (isVisible) {

					const colorClass = index >= constants.studentCount ? " color_grey_300" : "";
					studentElement = <div className="student" key={index.toString()} onClick={(event) => {
						this.showStuudentPopupDialog(student, event.clientX, event.clientY);
					}} onDoubleClick={() => this.showStudentUpdateDialog(student)}>
						<p className={"student_name" + colorClass}>{index + 1}. {student.fio}</p>
						<p className={"student_rating" + colorClass}>{student.rating}</p>
					</div>;
				}


				return studentElement;
			});

			if (isCollapsed && isVisibleExpandButton) {
				renderedStudents.push(<div className="student">
					<p className="student_name">........</p>
					<p className="student_rating">...</p>
				</div>);
			}

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


		let studentPopupDialog;
		if (this.state.studentPopupData.isShowingDialog) {
			const styles = {
				left: this.state.studentPopupData.dialogCoordinateX,
				top: this.state.studentPopupData.dialogCoordinateY
			};
			const student = this.state.studentPopupData.student;
			let firstGroup, secondGroup, thirdGroup;
			this.props.groups.forEach((group) => {
				if (group.id == student.priorityTwo) {
					secondGroup = group;
				}
				if (group.id == student.priorityThree) {
					thirdGroup = group;
				}
				if (group.id == student.priorityOne) {
					firstGroup = group;
				}
 			});

			studentPopupDialog = <StudentPopupDialog update={this.props.update} 
				student={student} 
				styles={styles}
				firstGroup={firstGroup}
				secondGroup={secondGroup}
				thirdGroup={thirdGroup}
				dismiss={() => this.dismissStudentPopupDialog()} 
				edit={() => this.showStudentUpdateDialog(this.state.studentPopupData.student)}
				remove={() => this.showStudentRemoveDialog()} />;
		}

		let studentRemoveDialog;
		if (this.state.studentRemovingData.isShowingDialog) {
			studentRemoveDialog = <StudentRemoveDialog studentId={this.state.studentRemovingData.studentId}
				update={this.props.update} 
				dismiss={() => this.dismissStudentRemoveDialog()} />
		}

		let studentEditDialog;
		if (this.state.studentAddingData.isShowingDialog) {
			studentEditDialog = <StudentEditDialog group={group} student={this.state.studentAddingData.student}
				update={this.props.update} dismiss={() => this.dismissStudentEditDialog()} />;
		}

		let studentExportingData;
		if (this.state.studentExportingData.isShowingDialog) {
			studentExportingData = <StudentExportDialog group={group} students={students} dismiss={() => {
				this.setState({ studentExportingData: { isShowingDialog: false } });
			}} />
		}

		return (
			<div className="group">
				{groupTitle}
				<div className="group_buttons">
					{expandButton}
					<div className="group_text_button margin_right_8 noselect" onClick={() => {
						this.showStudentEditDialog();
					}}>Добавить<br />студента</div>
					{collapsedButton}
				</div>
				<div className="student_box">{renderedStudents}</div>
				{exportButton}
				{studentEditDialog}				
				{studentPopupDialog}
				{studentRemoveDialog}
				{studentExportingData}
			</div>
		);
	}
}
