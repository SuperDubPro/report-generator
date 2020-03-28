import React from 'react';
import './Form.scss';
import params from "./reportParams";
import axios from 'axios';
import { default as Icon } from '../Icon';

export default class Form extends React.Component {
	constructor(props) {
		super(props);
		this.params = params;
		this.state = {
			data: {},
			fileName: "MyReport",
			storage: {},
			disableButton: true,
			wrongFileName: null
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleFileNameChange = this.handleFileNameChange.bind(this);
		this.setButtonStatus = this.setButtonStatus.bind(this);
	}

	componentDidMount() {
		let data = {};
		this.params.forEach(param => {
			data[param.key] = undefined
		});
		this.setState({ data });

		this.getStorage().then(res => {
			this.setState({ storage: res })
		});
	}

	handleInputChange(e) {
		const key = e.target.name;
		let data = this.state.data;
		data[key] = e.target.value;

		this.setState({data});
	}

	handleFileNameChange(e) {
		this.setState(
			{
				fileName: e.target.value
			},
			() => {
				this.setButtonStatus()
			}
		)
	}

	handleNameClick(e) {
		const fileId = e.target.id;
		const file = this.state.storage[fileId];
		this.setState({
			data: file.data,
			fileName: file.fileName
		});
	}

	generateReport() {
		return axios({
				method: 'post',
				url: '/generateReport',
				data: {
					// id: Date.now(),
					data: this.state.data,
					// fileName: 'MyReport',
				}
			}).then(res=> {
				return res;
		});
	}

	getStorage() {
		return axios.get('/storage').then(res => {
			return res.data;
		});
	}

	saveParams(){
		axios({
			method: 'post',
			url: '/saveParams',
			data: {
				id: Date.now(),
				data: this.state.data,
				fileName: this.state.fileName,
			}
		}).then(res=> {
			this.setState({
				storage: res.data
			});
		});
	}

	deleteParams(e) {
		axios({
			method: 'post',
			url: '/deleteParams',
			data: {
				id: e.target.id,
			}
		}).then(res=> {
			this.setState({
				storage: res.data
			});
		});
	}

	downloadReport() {
		const url = '/downloadReport';
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = `${this.state.fileName}.docx`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	}

	getReport() {
		this.generateReport().then(res => {
			this.downloadReport();
		});
	}

	isDataValid() {
		const data = this.state.data;
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
		const name = this.state.fileName;
		const rg1 = /^[^\\/:*?"<>|]+$/; // forbidden characters \ / : * ? " < > |
		const rg2 = /^\./; // cannot start with dot (.)
		const rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
		return rg1.test(name)&&!rg2.test(name)&&!rg3.test(name);
	};

	render() {
		const storage = this.state.storage;
		return (
			<section>
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
											value={this.state.data[param.key] || ''}/>
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
								value={this.state.fileName}
							/>
						</label>
						<div className='button-block'>
							<button
								onClick={e => this.getReport()}
								type='button'
								disabled={this.state.disableButton}
							>
								Создать отчет
							</button>
							<button
								onClick={e => this.saveParams()}
								type='button'
								disabled={this.state.disableButton}
							>
								Сохранить параметры
							</button>
						</div>
					</div>
				</div>
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
											{storage[file].fileName}
										</div>
										<div
											className="icon"
											id={storage[file].id}
											onClick={e => {this.deleteParams(e)}}
										>
											<Icon name='cross' />
										</div>
									</div>
								)
							})
						}
					</div>
				</div>
			</section>
		)
	}
}
