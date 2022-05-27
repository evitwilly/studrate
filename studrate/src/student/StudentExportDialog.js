import './StudentExportDialog.css';

import constants from '../core/Constants.js';

import React from 'react';
import axios from 'axios';

export default class StudentExportDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isXls: true,
			isEverything: false,
			isFio: true,
			isRating: true,
			isBirthday: false,
			isGender: false,
			isProfession: false,
			isDocumentSubmissionDate: false,
			isDocumentType: false,
			isDocumentSeria: false,
			isDocumentNumber: false,
			isDocumentIssueDate: false,
			isDocumentGiver: false,
			includeIsLimitedOpports: false,
			includeHasMedicine: false,
			includeHasOriginalDocs: false,
			includeIsInternationalContract: false,
			isEducationLevel: false,
			isEducationType: false,
			isEducationFinancials: false,
			isResidentialAddress: false,
			isRegistrationAddress: false,
			isBirthPlace: false,
			isSnils: false,
			isLocality: false,
			professions: []
		};
	}

	componentDidMount() {
		axios.get(constants.restData.getProfessions).then(response => {
			if (response.data.status == "success") {
				this.setState({ professions: response.data.result });
			}
		})
	}

	render() {
		const xlsTabStyle = this.state.isXls ? "export_type_box__tab export_type_box__tab_selected" : "export_type_box__tab";
		const csvTabStyle = !this.state.isXls ? "export_type_box__tab export_type_box__tab_selected" : "export_type_box__tab";		

		let fieldBoxView;
		if (this.state.isXls) {
			fieldBoxView = <div>
				<div className="student_export_dialog_subtitle">Выберите поля, которые хотите экспортировать:</div>
			
				<label className="export_field_label">Все<input className="export_checkbox"
					onChange={(event) => {
					this.setState(
						this.state.isEverything ? {
							isEverything: false,
							isFio: false,
							isRating: false,
							isBirthday: false,
							isGender: false,
							isProfession: false,
							isDocumentSubmissionDate: false,
							isDocumentType: false,
							isDocumentSeria: false,
							isDocumentNumber: false,
							isDocumentIssueDate: false,
							isDocumentGiver: false,
							includeIsLimitedOpports: false,
							includeHasMedicine: false,
							includeHasOriginalDocs: false,
							includeIsInternationalContract: false,
							isEducationLevel: false,
							isEducationType: false,
							isEducationFinancials: false,
							isResidentialAddress: false,
							isRegistrationAddress: false,
							isBirthPlace: false,
							isSnils: false,
							isLocality: false
						} : {
							isEverything: true,
							isFio: true,
							isRating: true,
							isBirthday: true,
							isGender: true,
							isProfession: true,
							isDocumentSubmissionDate: true,
							isDocumentType: true,
							isDocumentSeria: true,
							isDocumentNumber: true,
							isDocumentIssueDate: true,
							isDocumentGiver: true,
							includeIsLimitedOpports: true,
							includeHasMedicine: true,
							includeHasOriginalDocs: true,
							includeIsInternationalContract: true,
							isEducationLevel: true,
							isEducationType: true,
							isEducationFinancials: true,
							isResidentialAddress: true,
							isRegistrationAddress: true,
							isBirthPlace: true,
							isSnils: true,
							isLocality: true
						}
					);
				}} type="checkbox"/></label>

				<label className="export_field_label">ФИО<input className="export_checkbox" 
					checked={this.state.isFio} onChange={(event) => {
					this.setState({ isFio: !this.state.isFio });
				}} type="checkbox"/></label>

				<label className="export_field_label">Балл<input className="export_checkbox"
					checked={this.state.isRating} onChange={(event) => {
					this.setState({ isRating: !this.state.isRating })
				}} type="checkbox"/></label>
				<label className="export_field_label">Дата рождения<input className="export_checkbox" 
					checked={this.state.isBirthday} onChange={(event) => {
						this.setState({ isBirthday: !this.state.isBirthday })
					}} type="checkbox"/></label>
				<br />
				<label className="export_field_label">Пол<input className="export_checkbox" 
					checked={this.state.isGender} onChange={(event) => {
						this.setState({ isGender: !this.state.isGender })
					}} type="checkbox"/></label>
				<label className="export_field_label">Cпециальность<input className="export_checkbox" 
						checked={this.state.isProfession} onChange={(event) => {
						this.setState({ isProfession: !this.state.isProfession })
					}} type="checkbox"/></label>
				<br />
				<label className="export_field_label">Дата подачи документов<input className="export_checkbox" 
					checked={this.state.isDocumentSubmissionDate} onChange={(event) => {
						this.setState({ isDocumentSubmissionDate: !this.state.isDocumentSubmissionDate })
					}} type="checkbox"/></label>
				<label className="export_field_label">Тип документа<input className="export_checkbox" 
					checked={this.state.isDocumentType} onChange={(event) => {
						this.setState({ isDocumentType: !this.state.isDocumentType })
					}} type="checkbox"/></label>
				<br />
				<label className="export_field_label">Серия документа<input className="export_checkbox" 
					checked={this.state.isDocumentSeria} onChange={(event) => {
						this.setState({ isDocumentSeria: !this.state.isDocumentSeria })
					}} type="checkbox"/></label>
				<label className="export_field_label">Номер документа<input className="export_checkbox" 
					checked={this.state.isDocumentNumber} onChange={(event) => {
						this.setState({ isDocumentNumber: !this.state.isDocumentNumber })
					}} type="checkbox"/></label>
				<br />
				<label className="export_field_label">Дата выдачи документа<input className="export_checkbox" 
					checked={this.state.isDocumentIssueDate} onChange={(event) => {
						this.setState({ isDocumentIssueDate: !this.state.isDocumentIssueDate })
					}} type="checkbox"/></label>
				<label className="export_field_label">Кем был выдан<input className="export_checkbox"
					checked={this.state.isDocumentGiver} onChange={(event) => {
						this.setState({ isDocumentGiver: !this.state.isDocumentGiver })
					}} type="checkbox"/></label>
				<br />
				<label className="export_field_label">Закончил специальную организацию для учащихся с ОВЗ<input className="export_checkbox" 
					checked={this.state.includeIsLimitedOpports} onChange={(event) => {
						this.setState({ includeIsLimitedOpports: !this.state.includeIsLimitedOpports })
					}} type="checkbox"/></label>
				<br />
				<label className="export_field_label">Имеется медицинская справка<input className="export_checkbox" 
					checked={this.state.includeHasMedicine} onChange={(event) => {
						this.setState({ includeHasMedicine: !this.state.includeHasMedicine })
					}} type="checkbox"/></label>
				<label className="export_field_label">Поданы оригиналы документов<input className="export_checkbox" 
					checked={this.state.includeHasOriginalDocs} onChange={(event) => {
						this.setState({ includeHasOriginalDocs: !this.state.includeHasOriginalDocs })
					}} type="checkbox"/></label>
				<label className="export_field_label">Обучается по международному договору<input className="export_checkbox" 
					checked={this.state.includeIsInternationalContract} onChange={(event) => {
						this.setState({ includeIsInternationalContract: !this.state.includeIsInternationalContract })
					}} type="checkbox"/></label>
				<label className="export_field_label">Уровень образования<input className="export_checkbox"
					checked={this.state.isEducationLevel} onChange={(event) => {
						this.setState({ isEducationLevel: !this.state.isEducationLevel })
					}}  type="checkbox"/></label>
				<label className="export_field_label">Форма образования<input className="export_checkbox" 
					checked={this.state.isEducationType} onChange={(event) => {
						this.setState({ isEducationType: !this.state.isEducationType })
					}} type="checkbox"/></label>
				<label className="export_field_label">Финансирование<input className="export_checkbox" 
					checked={this.state.isEducationFinancials} onChange={(event) => {
						this.setState({ isEducationFinancials: !this.state.isEducationFinancials })
					}} type="checkbox"/></label>
				<label className="export_field_label">Адрес проживания<input className="export_checkbox" 
					checked={this.state.isResidentialAddress} onChange={(event) => {
						this.setState({ isResidentialAddress: !this.state.isResidentialAddress })
					}} type="checkbox"/></label>
				<label className="export_field_label">Адрес регистрации<input className="export_checkbox" 
					checked={this.state.isRegistrationAddress} onChange={(event) => {
						this.setState({ isRegistrationAddress: !this.state.isRegistrationAddress })
					}} type="checkbox"/></label>
				<label className="export_field_label">Место рождения<input className="export_checkbox" 
					checked={this.state.isBirthPlace} onChange={(event) => {
						this.setState({ isBirthPlace: !this.state.isBirthPlace })
					}} type="checkbox"/></label>
				<br />
				<label className="export_field_label">СНИЛС<input className="export_checkbox" 
					checked={this.state.isSnils} onChange={(event) => {
						this.setState({ isSnils: !this.state.isSnils })
					}} type="checkbox"/></label>
				<label className="export_field_label">Населенный пункт<input className="export_checkbox" 
					checked={this.state.isLocality} onChange={(event) => {
						this.setState({ isLocality: !this.state.isLocality })
					}} type="checkbox"/></label>

			</div>;
		} else {
			fieldBoxView = <div className="student_export_dialog_subtitle">Данный вид экспорта применяется для того, чтобы выгрузить данные из этой программы в <a href="https://netspo.edu22.info">АИС</a></div>;
		}	

		return <div className="core_container_dialog">
			<div className="core_dialog student_export_dialog">
				
				<h4 className="core_dialog_title student_edit_dialog_title">Экспорт<div className="core_dialog_close_button" onClick={() => this.props.dismiss()}>
					<svg className="core_dialog_close_button_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
				</div></h4>

				<div className="export_type_box">
					<div className={xlsTabStyle} onClick={() => {
						this.setState({ isXls: true });
					}}>XLS</div>
					<div className={csvTabStyle} onClick={() => {
						this.setState({ isXls: false });
					}}>CSV</div>
				</div>	

				{fieldBoxView}

				<div className="core_dialog_apply_button mt_16" onClick={() => {
					axios.post(constants.restData.postStudentExport, {
						type: this.state.isXls ? "xls" : "csv",
						group: this.props.group, 
						students: this.props.students,
						professions: this.state.professions,
						isFio: this.state.isFio,
						isRating: this.state.isRating,
						isBirthday: this.state.isBirthday,
						isGender: this.state.isGender,
						isProfession: this.state.isProfession,
						isDocumentSubmissionDate: this.state.isDocumentSubmissionDate,
						isDocumentType: this.state.isDocumentType,
						isDocumentSeria: this.state.isDocumentSeria,
						isDocumentNumber: this.state.isDocumentNumber,
						isDocumentIssueDate: this.state.isDocumentIssueDate,
						isDocumentGiver: this.state.isDocumentGiver,
						includeIsLimitedOpports: this.state.includeIsLimitedOpports,
						includeHasMedicine: this.state.includeHasMedicine,
						includeHasOriginalDocs: this.state.includeHasOriginalDocs,
						includeIsInternationalContract: this.state.includeIsInternationalContract,
						isEducationLevel: this.state.isEducationLevel,
						isEducationType: this.state.isEducationType,
						isEducationFinancials: this.state.isEducationFinancials,
						isResidentialAddress: this.state.isResidentialAddress,
						isRegistrationAddress: this.state.isRegistrationAddress,
						isBirthPlace: this.state.isBirthPlace,
						isSnils: this.state.isSnils,
						isLocality: this.state.isLocality
					}).then(response => {
						const link = document.createElement("a");
						link.href = response.data.result;
						link.style = "display: none";
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					});
				}}>Сохранить</div>
			</div>
		</div>;
	}
}