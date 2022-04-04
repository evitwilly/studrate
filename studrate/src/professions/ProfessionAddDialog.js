import './ProfessionAddDialog.css';

import constants from '../core/Constants.js';

import InputMask from "react-input-mask";
import React from 'react';
import axios from 'axios';

const profCodePattern = new RegExp("^[0-9]{2}.[0-9]{2}.[0-9]{2}$");

export default class ProfessionAddDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: "",
			nameError: "",
			code: "",
			codeError: ""
		};
	}

	render() {
		let nameError, codeError;
		if (this.state.nameError.length > 0) {
			nameError = <p className="core_input_error">{this.state.nameError}</p>;
		}
		if (this.state.codeError.length > 0) {
			codeError = <p className="core_input_error">{this.state.codeError}</p>;
		}

		return <div className="core_container_dialog">
			<div className="core_dialog">
				<h4 className="core_dialog_title">Добавление специальности<div className="core_dialog_close_button" onClick={() => {
					this.props.dismiss();
				}}>
					<svg className="core_dialog_close_button_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
				</div></h4>
				<input className="core_dialog_input"  placeholder="Название специальности" value={this.state.name} onChange={(event) => {
					this.setState({ name: event.target.value });
				}} />
				{nameError}
				<InputMask className="core_dialog_input" alwaysShowMask={true} mask="99.99.99" maskPlaceholder="-" value={this.state.code} onChange={(event) => {
					this.setState({ code: event.target.value });
				}} />
				{codeError}
				<div className="core_dialog_apply_button" onClick={() => {
					if (this.state.name.length <= 0) {
						this.setState({
							nameError: "Вы не указали название специальности"
						})
					} else if (!profCodePattern.test(this.state.code)) {
						this.setState({
							codeError: "Код специальности некорректный"
						});
					} else {
						axios.post(constants.restData.postProfessionAdd, {
							name: this.state.name, 
							code: this.state.code
						}).then(response => {
							this.props.update();
							this.props.dismiss();
						})
					}
				}}>Добавить</div>
			</div>
		</div>;
	}
}