import './Toolbar.css';

import constants from '../core/Constants.js';
import React from 'react';
import axios from 'axios';

export default class Toolbar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			groupCount: "3",
			studentCount: "50",
			isTwoGroup: false,
			isThreeGroup: false
		};
	}

	render() {
		return <div className="toolbar_box">
			<h2 className="toolbar_title">Студенты</h2>
			<div className="toolbar_buttons">
				<div className="test_label">Вторая группа: <input checked={this.state.isTwoGroup} onChange={() => {
					this.setState({ isTwoGroup: !this.state.isTwoGroup });
				}} className="test_checkbox" type="checkbox" /></div>
			
				<div className="test_label">Третья группа: <input checked={this.state.isThreeGroup} onChange={() => {
					this.setState({ isThreeGroup: !this.state.isThreeGroup });
				}} className="test_checkbox" type="checkbox" /></div>
				
				<input className="test_input margin_right_8" placeholder="группы" onChange={(event) => {
					this.setState({groupCount: event.target.value});
				}} value={this.state.groupCount} />

				<input className="test_input" placeholder="студенты" onChange={(event) => {
					this.setState({studentCount: event.target.value});
				}} value={this.state.studentCount} />

				<div className="toolbar_button noselect" onClick={() => {
					const groupInteger = parseInt(this.state.groupCount);
					const studentInteger = parseInt(this.state.studentCount);

					if (!isNaN(groupInteger) && !isNaN(studentInteger)) {
						axios.post(constants.restData.postStudentGenerate, {
							groupCount: groupInteger,
							studentCount: studentInteger,
							isTwoGroup: this.state.isTwoGroup,
							isThreeGroup: this.state.isThreeGroup
						}).then(response => {
							if (response.data["status"] == "success") {
								this.props.update();
							}
						});	
					}
				}}>Сгенерировать</div>
				<div className="toolbar_button noselect" onClick={() => {
					axios.post(constants.restData.postStudentClear).then(response => {
						if (response.data["status"] == "success") {
							this.props.update();
						}
					});
				}}>Удалить</div>

				<label className="toolbar_button noselect" onChange={(event) => {

					this.props.onStartImporting();
					
					const file = event.target.files[0];
				
					const formData = new FormData();
					formData.append("file", file)
								
					axios.post("http://localhost:3434/students/import", formData).then((response) => {
						if (response.data.status == "success") {
							this.props.update();
						}
					});
					
				}}><input type="file" />Импорт</label>

			</div>
		</div>;
	}
}