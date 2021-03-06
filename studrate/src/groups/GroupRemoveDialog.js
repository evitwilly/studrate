import './GroupRemoveDialog.css';

import constants from '../core/Constants.js';

import React from 'react';
import axios from 'axios';

export default class GroupRemoveDialog extends React.Component {

	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="core_container_dialog">
				<div className="core_dialog">
					<h4 className="core_dialog_title">Удаление группы
					<div className="core_dialog_close_button" onClick={() => this.props.dismiss()}>
						<svg className="core_dialog_close_button_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
					</div></h4>
					<p className="core_dialog_content_text">Вы действительно хотите удалить группу?</p>
					<div className="core_dialog_buttons">
						<div className="core_dialog_apply_button core_dialog_yes_button" onClick={() => {
							axios.post(constants.restData.postGroupRemove, { id: this.props.groupId }).then(response => {
								this.props.update();
								this.props.dismiss();
							});
						}}>Да</div>
						<div className="core_dialog_apply_button core_dialog_no_button" onClick={() => this.props.dismiss()}>Нет</div>
					</div>
				</div>
			</div>
		);
	}
}