import './StudentEditDialog.css';
import React from 'react';
import axios from 'axios';

export default class StudentDeleteDialog extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return <div className="student_delete_dialog_container" ref={(div) => this.dialog = div} onClick={(event) => {
			if (event.target == this.dialog) {
				this.props.dismiss();
			}
		}}>
			<div className="student_delete_dialog noselect" style={this.props.styles}>
				<div className="student_delete_dialog__item" onClick={() => {
					this.props.edit();
					this.props.dismiss();
				}}>Редактировать</div>
				<div className="student_delete_dialog__item" onClick={() => {
					axios.post("http://localhost:3434/students/remove", { id: this.props.student.id }).then(response => {
						if (response.data["status"] == "success") {
							this.props.update();
							this.props.dismiss();
						}
					});
				}}>Удалить</div>
			</div>
		</div>;
	}

}