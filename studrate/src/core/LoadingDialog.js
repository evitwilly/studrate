import React from 'react';

export default class LoadingDialog extends React.Component {

	render() {
		return (
			<div className="core_container_dialog">
				<div className="core_dialog">
					<h4 className="core_dialog_title">{this.props.title}</h4>
					<p className="core_dialog_content">{this.props.content}</p>
				</div>
			</div>
		);
	}
}