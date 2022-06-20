import './StudentEditDialog.css';

import constants from '../core/Constants.js';

import GroupSelectDialog from './GroupSelectDialog.js';
import InputMask from "react-input-mask";

import React from 'react';
import axios from 'axios';

const educationLevels = [
	"Не указано",
	"Без основного общего образования",
	"Высшее образование - бакалавриат",
	"Высшее образование - незаконченное высшее образование",
	"Высшее образование - подготовка кадров высшей квалификации",
	"Высшее образование - специалитет, магистратура",
	"Начальное профессиональное образование",
	"Неполное среднее профессиональное образование",
	"Основное общее образование",
	"СПО по программам подготовки квалифицированных рабочих (служащих)",
	"СПО по программам подготовки специалистов среднего звена",
	"Среднее общее образование"
];

const educationTypes = [
	"Не указано",
	"Заочное",
	"Очно-заочное",
	"Очное"
];

const apartaments = [
	"Не указано",
	"Не требуется",
	"Нуждается в общежитии",
	"Проживает в общежитии"
];

const documentTypes = [
	"Не указано",
	"Паспорт РФ",
	"Вид на жительство",
	"Военный билет",
	"Вр. военный билет",
	"Вр. удостоверение беженца РФ",
	"Временное удостоверение личности гражданина РФ",
	"Документ о вр. убежище на территории РФ",
	"Другой",
	"Загранпаспорт гражданина РФ",
	"Иностранное свид-во о рождении",
	"Иностранный паспорт",
	"Разрешение на вр. проживание в РФ",
	"Свид-во о рождении",
	"Свидетельство о предоставлении вр. убежища",
	"Свидетельство о ходатайстве беженца",
	"Удостоверение беженца РФ",
	"Удостоверение военнослужащего",
	"Удостоверение личности лица без гражданства РФ",
	"Удостоверение личности отдельных категорий лиц"
];

const financialTypes = [
	"Не указано",
	"За счет бюджета субъекта РФ",
	"За счет бюджета субъекта РФ по договору о целевом обучении",
	"За счет местного бюджета",
	"За счет местного бюджета по договору о целевом обучении",
	"За счет федерального бюджета",
	"За счет федерального бюджета по договору о целевом обучении",
	"За счет физических и юридических лиц по договору о целевом обучении",
	"За счет физического и юридического лица",
	"За счет физического лица",
	"За счет юридического лица",
	"По контракту для организаций ОПК"
]


function FormDelimiter() {
	return <div className="hr_box mt_16">
		<div className="hr_1"></div>
		<div className="hr_2"></div>
		<div className="hr_3"></div>
	</div>;
}

export default class StudentEditDialog extends React.Component {

	constructor(props) {
		super(props);

		const student = this.props.student;

		this.state = { 
			isGroupChoosing: false, 
			groups: [],
			professions: [],
			fio: {
				value: student != undefined ? student.fio : "",
				error: ""
			},
			rating: {
				value: student != undefined ? student.rating : "",
				error: ""
			},
			priority: {
				priorityOne: student != undefined ? student.priorityOne : this.props.group.id,
				priorityTwo: student != undefined ? student.priorityTwo : -1,
				priorityThree: student != undefined ? student.priorityThree : -1,
				prioritySelecting: -1, 
				error: "",
			}, 
			certificateNumber: student != undefined ? student.certificateNumber : "",
			birthDate: student != undefined ? student.birthDate : "",
			birthPlace: student != undefined ? student.birthPlace : "",
			prevEducationDate: student != undefined ? student.prevEducationDate : "",
			prevEducationOrg: student != undefined ? student.prevEducationOrg : "",
			documentIssueDate: student != undefined ? student.documentIssueDate : "",
			documentSubmissionDate: student != undefined ? student.documentSubmissionDate : "",
			documentType: student != undefined ? student.documentType : documentTypes[0],
			documentSeria: student != undefined ? student.documentSeria : "",
			documentNumber: student != undefined ? student.documentNumber : "",
			documentOrgCode: student != undefined ? student.documentOrgCode : "",
			apartaments: student != undefined ? student.apartaments : apartaments[0],
			snils: student != undefined ? student.snils : "",
			locality: student != undefined ? student.locality : "",
			documentGiver: student != undefined ? student.documentGiver : "",
			educationLevel: student != undefined ? student.educationLevel : educationLevels[0],
			educationType: student != undefined ? student.educationType : educationTypes[0],
			educationFinancials: student != undefined ? student.educationFinancials : financialTypes[0],
			residentialAddress: student != undefined ? student.residentialAddress : "",
			registrationAddress: student != undefined ? student.registrationAddress : "",
			isFemale: student != undefined ? student.isFemale : true,
			isLimitedOpports: student != undefined ? student.isLimitedOpports : false,
			hasMedicine: student != undefined ? student.hasMedicine : false,
			hasOriginalDocs: student != undefined ? student.hasOriginalDocs : true,
			isInternationalContract: student != undefined ? student.isInternationalContract : false
		};


	}

	changeFio(fio) {
		this.setState({
			fio: {
				value: fio,
				error: this.state.fio.error
			}
		});
	}

	changeRating(rating) {
		this.setState({
			rating: {
				value: rating,
				error: this.state.rating.error
			}
		});
	}	

	componentDidMount() {
		axios.get(constants.restData.getGroups).then((response) => {
			if (response.data.status == "success") {
				this.setState({ groups: response.data.result });
			}
		});
	}

	updatePriorityOne(groupId) {
		this.setState({ 
			isGroupChoosing: false, 
			priority: {
				priorityOne: groupId,
				priorityTwo: this.state.priority.priorityTwo,
				priorityThree: this.state.priority.priorityThree,
				prioritySelecting: -1, 
				error: this.state.priority.error,
			} 
		});
	}

	updatePriorityTwo(groupId) {
		this.setState({ 
			isGroupChoosing: false, 
			priority: {
				priorityOne: this.state.priority.priorityOne,
				priorityTwo: groupId,
				priorityThree: this.state.priority.priorityThree,
				prioritySelecting: -1, 
				error: this.state.priority.error,
			} 
		});
	}

	updatePriorityThree(groupId) {
		this.setState({ 
			isGroupChoosing: false, 
			priority: {
				priorityOne: this.state.priority.priorityOne,
				priorityTwo: this.state.priority.priorityTwo,
				priorityThree: groupId,
				prioritySelecting: -1, 
				error: this.state.priority.error,
			} 
		});
	}

	apply() {
		
		const fio = { value: this.fio.value, error: "" };
		if (fio.value.length <= 0 || fio.value.split(" ").length < 2) {
			fio.error = "вы некорректно заполнили ФИО студента";
		}

		const rating = { value: this.rating.value, error: "" };
		if (rating.value.length <= 0) {
			rating.error = "вы не указали балл студента";
		} else {
			const ratingNumber = parseFloat(rating.value);
			if (isNaN(ratingNumber)) {
				rating.error = "балл студента был некорректно указан";
			}
		}

		const priority = {
			priorityOne: this.state.priority.priorityOne,
			priorityTwo: this.state.priority.priorityTwo,
			priorityThree: this.state.priority.priorityThree,
			prioritySelecting: this.state.priority.prioritySelecting, 
			error: this.state.priority.error,
		};
		if (this.state.priority.priorityOne == -1) {
			priority.error = "вы не выбрали ни одну из групп"; 
		}

		if (fio.error.length <= 0 && rating.error.length <= 0 && priority.error.length <= 0) {
			
			const student = {
				fio: fio.value,
				rating: rating.value,
				priorityOne: priority.priorityOne,
				priorityTwo: priority.priorityTwo,
				priorityThree: priority.priorityThree,
				birthDate: this.state.birthDate, 
				birthPlace: this.state.birthPlace,
				snils: this.state.snils,
				locality: this.state.locality,
				isFemale: this.state.isFemale,
				certificateNumber: this.state.certificateNumber,
				apartaments: this.state.apartaments,
				prevEducationDate: this.state.prevEducationDate,
				prevEducationOrg: this.state.prevEducationOrg,
				documentSubmissionDate: this.state.documentSubmissionDate, 
				documentIssueDate: this.state.documentIssueDate,
				documentType: this.state.documentType,
				documentSeria: this.state.documentSeria, 
				documentNumber: this.state.documentNumber, 
				documentGiver: this.state.documentGiver, 
				documentOrgCode: this.state.documentOrgCode,
				isLimitedOpports: this.state.isLimitedOpports, 
				hasMedicine: this.state.hasMedicine,
				hasOriginalDocs: this.state.hasOriginalDocs, 
				isInternationalContract: this.state.isInternationalContract, 
				educationLevel: this.state.educationLevel,
				educationType: this.state.educationType, 
				educationFinancials: this.state.educationFinancials, 
				residentialAddress: this.state.residentialAddress,
				registrationAddress: this.state.registrationAddress
			};

			if (this.props.student != undefined) {
				student.id = this.props.student.id;
				axios.post(constants.restData.postStudentUpdate, student).then(response => {
					if (response.data.status == "success") {
						this.props.dismiss();
						this.props.update();
					}
				});
			} else {
				axios.post(constants.restData.postStudentAdd, student).then(response => {
					if (response.data.status == "success") {
						this.props.dismiss();
						this.props.update();
					}
				});
			}
		} else {
			this.setState({
				fio: fio,
				rating: rating,
				priority: priority
			});
		}
	}

	componentDidMount() {
		axios.get(constants.restData.getProfessions).then((response) => {
			this.setState({ professions: response.data.result.concat([ { id: -1, code: "", name: "Не указано"} ]) });
		});
		axios.get(constants.restData.getGroups).then((response) => {
			this.setState({ groups: response.data.result });
		});
	}

	showGroupSelectDialog(priority) {
		this.setState({
			isGroupChoosing: true, 
			priority: {
				priorityOne: this.state.priority.priorityOne,
				priorityTwo: this.state.priority.priorityTwo,
				priorityThree: this.state.priority.priorityThree,
				prioritySelecting: priority,
				error: this.state.priority.error
			}
		});
	}

	dismissGroupSelectDialog() {
		this.setState({ isGroupChoosing: false });
	}

	render() {

		const groups = this.state.groups;

		let groupDialog;
		if (this.state.isGroupChoosing) {
			groupDialog = <GroupSelectDialog groups={groups} update={(groupId) => {
				const priority = this.state.priority.prioritySelecting;
				if (priority == 1) {
					this.updatePriorityOne(groupId);
				} else if (priority == 2) {
					this.updatePriorityTwo(groupId);
				} else {
					this.updatePriorityThree(groupId);
				}
			}} dismiss={() => this.dismissGroupSelectDialog()} />;
		}

		let group1 = "не выбрано";
		let group2 = "не выбрано";
		let group3 = "не выбрано";

		const priorityOne = this.state.priority.priorityOne;
		const priorityTwo = this.state.priority.priorityTwo;
		const priorityThree = this.state.priority.priorityThree;

		groups.forEach((group) => {
			if (group.id == priorityOne) {
				group1 = group.name;
			} else if (group.id == priorityTwo) {
				group2 = group.name;
			} else if (group.id == priorityThree) {
				group3 = group.name;
			}
		});

		let fioError;
		if (this.state.fio.error.length > 0) {
			fioError = <p className="core_input_error">{this.state.fio.error}</p>;
		}

		let ratingError;
		if (this.state.rating.error.length > 0) {
			ratingError = <p className="core_input_error">{this.state.rating.error}</p>;
		}

		let priorityError;
		if (this.state.priority.error.length > 0) {
			priorityError = <p className="core_input_error">{this.state.priority.error}</p>;
		}

		const buttonText = this.props.student != undefined ? "Изменить" : "Добавить";
		const titleText = this.props.student != undefined ? "Редактирование студента" : "Добавление студента";

		return (
			<div className="core_container_dialog  vertical_scroll">
				<div className="core_dialog student_edit_dialog">
					
					<h4 className="core_dialog_title student_edit_dialog_title">{titleText}<div className="core_dialog_close_button" onClick={this.props.dismiss}>
						<svg className="core_dialog_close_button_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
					</div></h4>
				
					<input className="core_dialog_input mt_16" 
						value={this.state.fio.value}
						onChange={(event) => {
							this.changeFio(event.target.value)
						}}
						ref={(input) => this.fio = input}  placeholder="ФИО студента" maxLength="100" />
					{fioError}
					<input className="core_dialog_input" 
						value={this.state.rating.value}
						onChange={(event) => {
							this.changeRating(event.target.value)
						}}
						ref={(input) => this.rating = input} placeholder="4.5" maxLength="6" />
					{ratingError}
					<div className="core_dialog_input_label">дата рождения:</div>
					<InputMask className="core_dialog_input" alwaysShowMask={true} mask="99.99.9999"
						value={this.state.birthDate} onChange={(event) => {
							this.setState({ birthDate: event.target.value });
						}} />

					<div className="core_dialog_radiogroup"><span className="core_dialog_radiogroup_title">пол:</span> 
						<span className="core_dialog_radiogroup_option_text">мужской</span>
						<input className="core_dialog_radiogroup_check" type="radio" checked={!this.state.isFemale} value="male" onChange={(event) => {
							this.setState({isFemale: false});
						}} />
						<span className="core_dialog_radiogroup_option_text">женский</span>
						<input className="core_dialog_radiogroup_check" type="radio" checked={this.state.isFemale} value="female" onChange={(event) => {
							this.setState({isFemale: true});
						}}/>
					</div>

					<FormDelimiter />

					<div className="core_dialog_input_label">дата подачи документов:</div>						
					<InputMask className="core_dialog_input" alwaysShowMask={true} mask="99.99.9999"
					value={this.state.documentSubmissionDate} onChange={(event) => {
						this.setState({ documentSubmissionDate: event.target.value });
					}} />

					<input className="core_dialog_input" placeholder="номер аттестата" maxLength="30"
						value={this.state.certificateNumber} onChange={(event) => {
							this.setState({ certificateNumber: event.target.value });
						}}  />
				
					<div className="core_dialog_input_label">дата окончания предыдущего обучения:</div>						
					<InputMask className="core_dialog_input" alwaysShowMask={true} mask="99.99.9999"
					value={this.state.prevEducationDate} onChange={(event) => {
						this.setState({ prevEducationDate: event.target.value });
					}} />

					<input className="core_dialog_input" placeholder="предыдущая образовательная организация" maxLength="256"
						value={this.state.prevEducationOrg} onChange={(event) => {
							this.setState({ prevEducationOrg: event.target.value });
						}}  />

					<FormDelimiter />

					<div className="core_dialog_input_label">тип документа:</div>
					<div className="core_dialog_select_box">
					<select className="core_dialog_select" value={this.state.documentType} onChange={(event) => {
						this.setState({ documentType: event.target.value });
					}} >
						{documentTypes.map((docType) => <option className="core_dialog_option" value={docType}>{docType}</option>)}
					</select>
					</div>

					<input className="core_dialog_input" placeholder="серия документа" maxLength="8"
						value={this.state.documentSeria} onChange={(event) => {
							this.setState({ documentSeria: event.target.value });
						}}  />

					<input className="core_dialog_input" placeholder="номер документа" maxLength="16"
						value={this.state.documentNumber} onChange={(event) => {
							this.setState({ documentNumber: event.target.value });
						}} />

					<input className="core_dialog_input" placeholder="код подразделения" maxLength="32"
						value={this.state.documentOrgCode} onChange={(event) => {
							this.setState({ documentOrgCode: event.target.value });
						}} />

					<div className="core_dialog_input_label">дата выдачи документа:</div>
					<InputMask className="core_dialog_input" alwaysShowMask={true} mask="99.99.9999"
						value={this.state.documentIssueDate} onChange={(event) => {
							this.setState({ documentIssueDate: event.target.value });
						}} />

					<input className="core_dialog_input" placeholder="кем выдан документ" maxLength="128"
						value={this.state.documentGiver} onChange={(event) => {
							this.setState({ documentGiver: event.target.value });
						}} />

					<div className="core_dialog_input_label">СНИЛС:</div>
					<InputMask className="core_dialog_input" alwaysShowMask={true} mask="999-999-999 99"
						value={this.state.snils} 
						onChange={(event) => this.setState({ snils: event.target.value })} />

					<FormDelimiter />

				 	<div className="core_dialog_radiogroup"><span className="core_dialog_radiogroup_title">закончил специальную организацию для учащихся с ОВЗ:</span> 
						<span className="core_dialog_radiogroup_option_text">да</span>
						<input className="core_dialog_radiogroup_check" type="radio" checked={this.state.isLimitedOpports} value="male" onChange={(event) => {
							this.setState({isLimitedOpports: true});
						}} />
						<span className="core_dialog_radiogroup_option_text">нет</span>
						<input className="core_dialog_radiogroup_check" type="radio" checked={!this.state.isLimitedOpports} value="female" onChange={(event) => {
							this.setState({isLimitedOpports: false});
						}}/>
					</div>

					<div className="core_dialog_radiogroup"><span className="core_dialog_radiogroup_title">имеется медицинская справка:</span> 
						<span className="core_dialog_radiogroup_option_text">да</span>
						<input className="core_dialog_radiogroup_check" type="radio" checked={this.state.hasMedicine} value="male" onChange={(event) => {
							this.setState({hasMedicine: true});
						}} />
						<span className="core_dialog_radiogroup_option_text">нет</span>
						<input className="core_dialog_radiogroup_check" type="radio" checked={!this.state.hasMedicine} value="female" onChange={(event) => {
							this.setState({hasMedicine: false});
						}}/>
					</div>

					<div className="core_dialog_radiogroup"><span className="core_dialog_radiogroup_title">поданы оригиналы документов:</span> 
						<span className="core_dialog_radiogroup_option_text">да</span>
						<input className="core_dialog_radiogroup_check" type="radio" checked={this.state.hasOriginalDocs} value="male" onChange={(event) => {
							this.setState({hasOriginalDocs: true});
						}} />
						<span className="core_dialog_radiogroup_option_text">нет</span>
						<input className="core_dialog_radiogroup_check" type="radio" checked={!this.state.hasOriginalDocs} value="female" onChange={(event) => {
							this.setState({hasOriginalDocs: false});
						}}/>
					</div>

					<div className="core_dialog_radiogroup"><span className="core_dialog_radiogroup_title">обучается по международному договору:</span> 
						<span className="core_dialog_radiogroup_option_text">да</span>
						<input className="core_dialog_radiogroup_check" type="radio" checked={this.state.isInternationalContract} value="male" onChange={(event) => {
							this.setState({isInternationalContract: true});
						}} />
						<span className="core_dialog_radiogroup_option_text">нет</span>
						<input className="core_dialog_radiogroup_check" type="radio" checked={!this.state.isInternationalContract} value="female" onChange={(event) => {
							this.setState({isInternationalContract: false});
						}}/>
					</div>

					<FormDelimiter />

					<div className="core_dialog_input_label">уровень образования:</div>
					<div className="core_dialog_select_box">
					<select className="core_dialog_select" value={this.state.educationLevel} onChange={(event) => {
						this.setState({ educationLevel: event.target.value });
					}} >
						{educationLevels.map((edLevel) => <option className="core_dialog_option" value={edLevel}>{edLevel}</option>)}
					</select>
					</div>

					<div className="core_dialog_input_label">форма:</div>
					<div className="core_dialog_select_box">
					<select className="core_dialog_select" value={this.state.educationType} onChange={(event) => {
						this.setState({ educationType: event.target.value });
					}} >
						{educationTypes.map((edType) => <option className="core_dialog_option" value={edType}>{edType}</option>)}
					</select>
					</div>

					<div className="core_dialog_input_label">финансирование:</div>
					<div className="core_dialog_select_box">
					<select className="core_dialog_select" value={this.state.educationFinancials} onChange={(event) => {
						this.setState({ educationFinancials: event.target.value });
					}}>
						{financialTypes.map((finType) => <option className="core_dialog_option" value={finType}>{finType}</option>)}
					</select>
					</div>

					<FormDelimiter />

					<div className="core_dialog_input_label">общежитие:</div>
					<div className="core_dialog_select_box">
					<select className="core_dialog_select" value={this.state.apartaments} onChange={(event) => {
						this.setState({ apartaments: event.target.value });
					}}>
						{apartaments.map((apartament) => <option className="core_dialog_option" value={apartament}>{apartament}</option>)}
					</select>
					</div>
					
					<input className="core_dialog_input" placeholder="адрес проживания" maxLength="500"
						value={this.state.residentialAddress} 
						onChange={(event) => this.setState({residentialAddress: event.target.value})} />

					<input className="core_dialog_input" placeholder="адрес регистрации" maxLength="500"
						value={this.state.registrationAddress}
						onChange={(event) => this.setState({registrationAddress: event.target.value})} />

					<input className="core_dialog_input" placeholder="место рождения" maxLength="128"
						value={this.state.birthPlace}
						onChange={(event) => this.setState({ birthPlace: event.target.value })} />

					<input className="core_dialog_input" placeholder="населённый пункт" maxLength="256"
						value={this.state.locality}
						onChange={(event) => this.setState({ locality: event.target.value })} />

					<p className="group_priority_text">Первая группа: <span className="group_priority_element" onClick={() => {
						this.showGroupSelectDialog(1);
					}}>{group1}</span></p>
					<p className="group_priority_text">Вторая группа: <span className="group_priority_element" onClick={() => {
						this.showGroupSelectDialog(2);
					}}>{group2}</span></p>
					<p className="group_priority_text">Третья группа: <span className="group_priority_element" onClick={() => {
						this.showGroupSelectDialog(3);
					}}>{group3}</span></p>
					{priorityError}
					<div className="core_dialog_apply_button" onClick={() => this.apply()}>{buttonText}</div>
				</div>
				{groupDialog}
			</div>
		);
	}
}