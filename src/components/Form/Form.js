import React from 'react';
import './Form.scss';
import params from "./reportParams";

export default class Form extends React.Component {
	constructor(props) {
		super(props);
		this.params = params;
		this.state = {
			disableButton: true,
			wrongFileName: null
		};
	}

	componentDidMount() {
		let data = {};
		this.params.forEach(param => {
			data[param.key] = undefined
		});
		this.props.pageSetState('docxData', data)
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if(
			(prevProps.pageState.docxData !== this.props.pageState.docxData)
			|| (prevProps.pageState.docxName !== this.props.pageState.docxName)
		){
			this.setButtonStatus();
		}
	}

	handleInputChange(e) {
		const key = e.target.name;
		let data = this.props.pageState.docxData;
		data[key] = e.target.value;
		this.props.pageSetState('docxData', data)
	}

	handleFileNameChange(e) {
		let promise = new Promise((res, rej) => {
			res(this.props.pageSetState('docxName', e.target.value));
			rej(new Error('Ошибка при изменении имени'))
		});
		promise.then(res => this.setButtonStatus())
	}

	isDataValid() {
		const data = this.props.pageState.docxData;
		return Object.keys(data).every(key => {
			const val = data[key];
			return val !== null && val !== undefined && val.trim() !== ''
		});
	}

	setButtonStatus() {
		let disableButton = !this.isDataValid();
		const isValidName = this.isValidFileName();
		if (!isValidName) disableButton = true;
		if(this.state.disableButton !== disableButton) {
			this.setState({disableButton});
		}
	}

	isValidFileName() {
		const name = this.props.pageState.docxName;
		const rg1 = /^[^\\/:*?"<>|]+$/; // forbidden characters \ / : * ? " < > |
		const rg2 = /^\./; // cannot start with dot (.)
		const rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
		return rg1.test(name)&&!rg2.test(name)&&!rg3.test(name);
	};

	render() {
		const pageState = this.props.pageState;
		const data = pageState.docxData;
		return (
			<div className='form-wrapper'>
				<div>
					{
						this.params.map(param => {
							return (
								<label key={`${param.key}Label`}>
									{param.name}:
									<input
										key={param.key}
										name={param.key}
										onChange={e => {
											this.handleInputChange(e);
											this.setButtonStatus();
										}}
										value={data[param.key] || ''}
									/>
								</label>
							)
						})
					}
					<label>
						Название файла:
						<input
							className={this.isValidFileName() ? null : 'not-valid'}
							onChange={e => {
								this.handleFileNameChange(e);
							}}
							value={pageState.docxName}
						/>
					</label>
					<div className='button-block'>
						<button
							onClick={e => this.props.getDoc('docx')}
							type='button'
							disabled={this.state.disableButton}
						>
							Скачать отчет
						</button>
						<button
							onClick={e => this.props.saveParams()}
							type='button'
							disabled={this.state.disableButton}
						>
							Сохранить параметры
						</button>
					</div>
				</div>
			</div>
		)
	}
}
