import './Test.css';

import React from 'react';
import axios from 'axios';

export default class Test extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			test_input_text: "10"
		};
	}

	render() {
		return <div className="test_box">
			<input className="test_input" onChange={(event) => {
				this.setState({test_input_text: event.target.value});
			}} value={this.state.test_input_text} />
			<div className="test_button noselect" onClick={() => {
				const integer = parseInt(this.state.test_input_text);

				if (!isNaN(integer) && integer > 0 && integer <= 1000) {
					axios.post("http://localhost:3434/test/generate", {student_count: integer}).then(response => {
						if (response.data["status"] == "success") {
							this.props.update();
						}
					});	
				}
			}}>Сгенерировать</div>
			<div className="test_button noselect" onClick={() => {
				axios.post("http://localhost:3434/test/remove").then(response => {
					if (response.data["status"] == "success") {
						this.props.update();
					}
				});
			}}>Удалить</div>
		</div>;
	}
}