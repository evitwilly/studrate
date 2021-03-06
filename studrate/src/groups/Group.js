import './Group.css';


import constants from '../core/Constants.js';

import React from 'react';
import axios from 'axios';

export default class Group extends React.Component {

	render() {
		const textView = <p className="group_name">{this.props.group.name}</p>;
		
		const deleteView = <div className="group_delete_button" onClick={() => this.props.showDialog()}>
			<svg className="group_delete_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
		</div>

		const groupCount = <p className="group_count">{this.props.group.count}</p>;

		return <div className="group_item" onDoubleClick={() => this.props.edit()}>
			{textView}
			{deleteView}
			{groupCount}
		</div>
	}
}