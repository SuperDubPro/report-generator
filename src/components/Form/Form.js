import React from 'react';
import './Form.scss';
import params from "./reportParams";
import axios from 'axios';

export default class Form extends React.Component {
	constructor(props) {
		super(props);
		this.params = params;
		this.state = {
			data: {},
			fileName: "MyReport",
			filesList: ["121212","2121231242"]
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleFileNameChange = this.handleFileNameChange.bind(this);
	}

	componentDidMount() {
		let data = {};
		this.params.forEach(param => {
			data[param.key] = undefined
		});
		this.setState({
			data
		})
		// axios
		// 	.get('http://localhost:3000/qwerty')
		// 	.then(res => {
		// 		console.log(res);
		// 		let blob = new Blob([res.data], { type: 'application/docx' });
		// 		console.log(blob);
		// 		const url = window.URL.createObjectURL(blob);
		// 		const a = document.createElement('a');
		// 		a.style.display = 'none';
		// 		a.href = url;
		// 		a.download = 'report';
		// 		document.body.appendChild(a);
		// 		console.log(a)
		// 		a.click();
		// 		window.URL.revokeObjectURL(url);
		// 		document.body.removeChild(a);
		// 	})
		// .catch(error => new error(error));
	}

	handleInputChange(e) {
		const key = e.target.name;
		let data = this.state.data;
		data[key] = e.target.value;

		this.setState({
			data
		});
	}

	handleFileNameChange(e) {
		this.setState({
			fileName: e.target.value
		})
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
				console.log(res);
				return res;
		});
	}

	saveReport() {
		const url = '/saveReport';
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		// a.download = `MyReport.docx`;
		a.download = `${this.state.fileName}.docx`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	}

	async getReport() {
		await this.sendParams().then(res => {
			console.log(res);
			this.saveReport();
		});
	}

	render() {
		return (
			<section>
				<div className='form-wrapper'>
					<div>
						{/*<a href="/saveReport" download> ссылка </a>*/}
						{
							this.params.map(param => {
								// console.log(this.state[param.key])
								return (
									<label key={`${param.key}Label`}>
										{param.name}:
										<input key={param.key} name={param.key} onChange={e => this.handleInputChange(e)} value={this.state.data[param.key] || ''}/>
									</label>
								)
							})
						}
						<label>
							Название файла:
							<input onChange={e => this.handleFileNameChange(e)} value={this.state.fileName}/>
						</label>
						<button onClick={e => this.getReport()} type="button">Создать отчет</button>
					</div>
				</div>
				<div className='files-list-wrapper'>
					<div id="files-list">
						{
							this.state.filesList.map(file => {
								return (
									<div className='file' key={file}> {file} </div>
								)
							})
						}
					</div>
				</div>
			</section>
		)
	}
}
