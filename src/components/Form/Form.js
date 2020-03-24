import React from 'react';
import './Form.scss';
import params from "./reportParams";
import axios from 'axios';
import JSZip from 'jszip';
import saveAs from 'file-saver';


export default class Form extends React.Component {
	constructor(props) {
		super(props);
		this.params = params;
		this.state = {
			data: {},
			fileName: "MyReport",
			filesList: ["121212","2111111111111111111121231242"],
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
		// const disableButton = !this.isDataValid();
		this.setState({
			data
		})
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

	sendParams() {
		return axios({
				method: 'post',
				url: '/generateReport',
				data: {
					data: this.state.data,
					fileName: 'MyReport'
				}
			}).then(res=> {
				return res;
		});
	}

	saveReport() {
		const url = '/saveReport';
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = `${this.state.fileName}.docx`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	}

	async getReport() {
		await this.sendParams().then(res => {
			this.saveReport();
		});
		// await this.sendParams().then(res => {
		// 	let zip = new JSZip();
		// 	// console.log(res.data);
		// 	console.log(res);
		// 	const fileName = `${this.state.fileName}.docx`;
		// 	let blob = new Blob([res.data], {type: res.headers['content-type']});
		// 	zip.file(fileName, res.data);
		// 	zip.generateAsync({type:"blob"}).then(function (blob) { // 1) generate the zip file
		// 		saveAs(blob, "report.zip");                          // 2) trigger the download
		// 	}, function (err) {
		// 		new Error(err);
		// 	});
		// 	saveAs(res.data, fileName)
		// })
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
		const rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
		const rg2 = /^\./; // cannot start with dot (.)
		const rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
		return rg1.test(name)&&!rg2.test(name)&&!rg3.test(name);
	};

	render() {
		return (
			<section>
				<div className='form-wrapper'>
					<div>
						{/*<a href="/saveReport" download> ссылка </a>*/}
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
						<button
							onClick={e => this.getReport()}
							type="button"
							disabled={this.state.disableButton}
						>
							Создать отчет
						</button>
					</div>
				</div>
				{/*<div className='files-list-wrapper'>*/}
				{/*	<div id="files-list">*/}
				{/*		{*/}
				{/*			this.state.filesList.map(file => {*/}
				{/*				return (*/}
				{/*					<div className='file' key={file}>*/}
				{/*						<div className="text">{file}</div>*/}
				{/*						<div className="icon">x</div>*/}
				{/*					</div>*/}
				{/*				)*/}
				{/*			})*/}
				{/*		}*/}
				{/*	</div>*/}
				{/*</div>*/}
			</section>
		)
	}
}
