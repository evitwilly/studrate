import './StudentPopupDialog.css';
import React from 'react';
import axios from 'axios';

export default class StudentPopupDialog extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

		let secondGroupView, thirdGroupView;
		if (this.props.secondGroup != undefined) {
			secondGroupView = <div className="student_popup_dialog___group_item"><b>вторая:</b>{" " + this.props.secondGroup.name}</div>;
		}
		if (this.props.thirdGroup != undefined) {
			thirdGroupView = <div className="student_popup_dialog___group_item"><b>третья:</b>{" " + this.props.thirdGroup.name}</div>;
		}
 
		return <div className="student_popup_dialog_container" ref={(div) => this.dialog = div} onClick={(event) => {
			if (event.target == this.dialog) {
				this.props.dismiss();
			}
		}}>
			<div className="student_popup_dialog noselect" style={this.props.styles}>
				<div className="student_popup_dialog___group_item"><b>первая:</b>{" " + this.props.firstGroup.name}</div>
				{secondGroupView}
				{thirdGroupView}
				<div style={{
					height: "1px",
					backgroundColor: "#000"
				}} />
				<div className="student_popup_dialog__item" onClick={() => {
					this.props.edit();
					this.props.dismiss();
				}}>Редактировать</div>
				<div className="student_popup_dialog__item" onClick={() => {
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