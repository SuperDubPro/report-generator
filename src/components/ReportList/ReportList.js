import React from 'react';
import './ReportList.scss';
import { default as Icon } from '../Icon';

export default class Form extends React.Component {
	handleNameClick(e) {
		const fileId = e.target.id;
		const file = this.props.pageState.storage[fileId];
		this.props.pageSetState(['docxData', 'docxName', 'specData', 'specName'], [file.docxData, file.docxName, file.specData, file.specName])
	}

	render() {
		const pageState = this.props.pageState;
		const storage = pageState.storage;
		return (
			<div className='files-list-wrapper'>
				<div id="files-list">
					{
						Object.keys(storage).map(file => {
							return (
								<div className='file' key={storage[file].id}>
									<div
										className="text"
										id={storage[file].id}
										onClick={e => this.handleNameClick(e)}
									>
										{storage[file].docxName}
									</div>
									<div
										className="icon"
										id={storage[file].id}
										onClick={e => {this.props.deleteParams(e)}}
									>
										<Icon name='cross' />
									</div>
								</div>
							)
						})
					}
				</div>
		</div>
		)
	}
}
