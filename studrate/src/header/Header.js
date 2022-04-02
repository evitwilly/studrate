import './Header.css';
import React from 'react';
import ReactDOM from 'react-dom';

export default class Header extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = { search: "by_group" };
	}

	updateSearch() {
		let searchData;
		if (this.state.search == "by_group") {
			searchData = "by_student";
		} else {
			searchData = "by_group";
		}
		this.setState({ search: searchData });
		this.props.updateSearchType(searchData);
	}

	render() {

		let sortButtonText;
		if (this.state.search == "by_group") {
			sortButtonText = "по группе";
		} else {
			sortButtonText = "по студенту";
		}

		return (
			<header className="header">
				<h2 className="header_title">StudRate</h2>
				<div className="search_box">
					<input className="search_input" placeholder="Поиск" onChange={(target) => this.props.onChange(target.target.value)} />
					<div className="header_button noselect" onClick={() => this.updateSearch()}>{sortButtonText}</div>
				</div>
				<div className="menu_box">
					<div className="menu_item noselect">Группы</div>
					<div className="menu_item noselect">Специальности</div>
				</div>
				<div className="menu_button">
					<svg className="menu_button_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z"/></svg>
				</div>
			</header>
		);
	}

}
