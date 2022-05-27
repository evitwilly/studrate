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
			profession: this.props.profession != null ? this.props.profession.name : "",
			professionError: "",
			group: this.props.profession != null ? this.props.profession.abbrevation : "",
			groupError: "",
			code: this.props.profession != null ? this.props.profession.code : "",
			codeError: ""
		};
	}

	render() {
		let professionErrorView; 
		if (this.state.professionError.length > 0) {
			professionErrorView = <p className="core_input_error">{this.state.professionError}</p>;
		}

		let groupErrorView;
		if (this.state.groupError.length > 0) {
			groupErrorView = <p className="core_input_error">{this.state.groupError}</p>;
		}

		let codeError;
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
				<input className="core_dialog_input"  placeholder="Название специальности" value={this.state.profession} onChange={(event) => {
					this.setState({ profession: event.target.value });
				}} />
				{professionErrorView}
				<input className="core_dialog_input"  placeholder="Название группы" value={this.state.group} onChange={(event) => {
					this.setState({ group: event.target.value });
				}} />
				{groupErrorView}
				<InputMask className="core_dialog_input mb_16" alwaysShowMask={true} mask="99.99.99" maskPlaceholder="-" value={this.state.code} onChange={(event) => {
					this.setState({ code: event.target.value });
				}} />
				{codeError}
				<div className="core_dialog_apply_button" onClick={() => {
					if (this.state.profession.length <= 0) {
						this.setState({
							professionError: "Вы не указали название специальности"
						})
					} else if (this.state.group.length <= 0) {
						this.setState({
							groupError: "Вы не указали название группы"
						});
					} else if (!profCodePattern.test(this.state.code)) {
						this.setState({
							codeError: "Код специальности некорректный"
						});
					} else {
						console.log(this.state.profession);
						if (this.props.profession != null) {
							axios.post(constants.restData.postProfessionUpdate, {
								id: this.props.profession.id,
								name: this.state.profession, 
								code: this.state.code,
								abbrevation: this.state.group
							}).then(response => {
								this.props.update();
								this.props.dismiss();
							});
						} else {
							axios.post(constants.restData.postProfessionAdd, {
								name: this.state.profession, 
								code: this.state.code,
								abbrevation: this.state.group
							}).then(response => {
								this.props.update();
								this.props.dismiss();
							});
						}
					}
				}}>{this.props.profession != null ? "Изменить" : "Добавить"}</div>
			</div>
		</div>;
	}
}