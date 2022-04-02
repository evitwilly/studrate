import './Profession.css';

import Header from '../header/Header.js';

import constants from '../core/Constants.js';

import React from 'react';
import axios from 'axios';

export default class Professions extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
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
		const professionDivs = this.state.professions.map((profession) => {
			return <div className="profession_item">
				<div className="profession_code">{profession.code}</div> 
				<div className="profession_name">{profession.name}</div>
			</div>;
		});
		return <div>
			<Header onSearchChange={this.search} toggleSearch={this.toggleSearch} />
			<h2 className="profession_title">Специальности</h2>
			<div className="profession_box">
				{professionDivs}
			</div>
		</div>
	}
}
