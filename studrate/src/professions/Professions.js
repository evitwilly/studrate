import './Profession.css';

import Header from '../header/Header.js';
import ProfessionAddDialog from './ProfessionAddDialog.js';
import ProfessionRemoveDialog from './ProfessionRemoveDialog.js';

import constants from '../core/Constants.js';

import InputMask from "react-input-mask";
import React from 'react';
import axios from 'axios';

export default class Professions extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			professions: [],
			isAddingProfession: false,
			isRemovingProfession: false,
			isEditingProfession: false,
			editingProfession: null,
			removingProfessionId: -1,
			searchKey: ""
		};
	}

	getProfessions() {
		axios.get(constants.restData.getProfessions).then(response => {
			if (response.data.status == "success") {
				this.setState({ professions: response.data.result });
			}
		})
	}

	componentDidMount() {
		this.getProfessions();
	}

	render() {
		const professionDivs = this.state.professions.filter((profession) => {
			return profession.name.toLowerCase().indexOf(this.state.searchKey.toLowerCase()) != -1;
		}).map((profession) => {
			return <div className="profession_item">
				<div className="profession_code">{profession.code}</div> 
				<div className="profession_name">{profession.name + " (" + profession.abbrevation + ")"}</div>


				<div className="profession_edit_button" onClick={() => {
					this.setState({
						isEditingProfession: true,
						editingProfession: profession
					});
				}}>
					<svg fill="#fff" className="profession_edit_button_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M362.7 19.32C387.7-5.678 428.3-5.678 453.3 19.32L492.7 58.75C517.7 83.74 517.7 124.3 492.7 149.3L444.3 197.7L314.3 67.72L362.7 19.32zM421.7 220.3L188.5 453.4C178.1 463.8 165.2 471.5 151.1 475.6L30.77 511C22.35 513.5 13.24 511.2 7.03 504.1C.8198 498.8-1.502 489.7 .976 481.2L36.37 360.9C40.53 346.8 48.16 333.9 58.57 323.5L291.7 90.34L421.7 220.3z"/></svg>
				</div>

				<div className="profession_remove_button" onClick={() => {
					this.setState({
						isRemovingProfession: true,
						removingProfessionId: profession.id
					});
				}}>
					<svg className="profession_remove_button_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
				</div>
			</div>;
		});


		let addingView;
		if (this.state.isAddingProfession) {			
			addingView = <ProfessionAddDialog dismiss={() => this.setState({ isAddingProfession: false })} 
				update={() => this.getProfessions()} />;
		}

		let editingDialogView;
		if (this.state.isEditingProfession) {			
			editingDialogView = <ProfessionAddDialog profession={this.state.editingProfession} dismiss={() => this.setState({ isEditingProfession: false, editingProfession: null })} 
				update={() => this.getProfessions()} />;
		}

		let removingView;
		if (this.state.isRemovingProfession) {
			removingView = <ProfessionRemoveDialog dismiss={() => this.setState({ isRemovingProfession: false })}
				update={() => this.getProfessions()} professionId={this.state.removingProfessionId} />
		}

		return <div>
			<Header onSearchChange={(text) => {
				this.setState({searchKey: text});
			}} toggleSearch={this.toggleSearch} />
			<div className="profession_toolbar">
				<h2 className="profession_title">Специальности</h2>
				<div className="profession_toolbar_buttons">
					<div className="core_button profession_toolbar_button" onClick={() => {
						this.setState({	isAddingProfession: true });
					}}>Добавить</div>
				</div>
			</div>
			<div className="profession_box">
				{professionDivs}
			</div>
			{addingView}
			{removingView}
			{editingDialogView}
		</div>
	}
}
