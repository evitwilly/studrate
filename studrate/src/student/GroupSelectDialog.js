import './GroupSelectDialog.css';

import React from 'react';

export default class GroupSelectDialog extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const groups = this.props.groups;

		const groupDivs = groups.map((group) => {
			return <div className="group_box__item" key={group.id.toString()} onClick={() => {
				this.props.update(group.id);
			}}>{group.name}</div>
		});
		groupDivs.push(<div className="group_box__item" key={groupDivs.length.toString()} onClick={() => {
			this.props.update(-1);
		}}>нет</div>);

		return (<div className="group_container_dialog" ref={(div) => this.groupDialog = div } onClick={(event) => {
			if (event.target == this.groupDialog) {
				this.props.dismiss();
			}
		}}>
			<div className="group_dialog">
				<p className="group_dialog_title">Выберите группу из списка:</p>
				<div className="group_box">{groupDivs}</div>
			</div>
		</div>);
	}

}