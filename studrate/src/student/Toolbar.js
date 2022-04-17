import './Toolbar.css';

import constants from '../core/Constants.js';
import React from 'react';
import axios from 'axios';

export default class Toolbar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			groupCount: "3",
			studentCount: "50",
			isTwoGroup: false,
			isThreeGroup: false
		};
	}

	render() {
		return <div className="toolbar_box">
			<h2 className="toolbar_title">Студенты</h2>
			<div className="toolbar_buttons">
				<label className="toolbar_button noselect" onChange={(event) => {

					this.props.onStartImporting();
					
					const file = event.target.files[0];
				
					const formData = new FormData();
					formData.append("file", file)
								
					axios.post("http://localhost:3434/students/import", formData).then((response) => {
						if (response.data.status == "success") {
							this.props.update();
						}
					});
					
				}}><input type="file" />Импорт</label>
			</div>
		</div>;
	}
}