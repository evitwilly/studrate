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
					<div className="header_button" onClick={() => this.updateSearch()}>{sortButtonText}</div>
					<div className="header_button" onClick={() => this.props.addGroup()}>Добавить группу</div>
				</div>
			</header>
		);
	}

}
