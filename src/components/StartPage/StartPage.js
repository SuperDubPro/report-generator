import React from "react";
import "./StartPage.scss";

import axios from "axios";

import { default as Form } from '../Form';
import { default as ReportList } from '../ReportList';
import { default as Table } from '../Table';

export default class StartPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			storage: {},
			docxName: 'MyReport',
			docxData: {},
			specName: 'MySpec',
			specData: {},
			ks2Name: 'MyKS2',
			ks3Name: 'MyKS3',
		};
		this.pageSetState = this.pageSetState.bind(this);
		this.getDoc = this.getDoc.bind(this);
		this.generate = this.generate.bind(this);
		this.download = this.download.bind(this);
		this.saveParams = this.saveParams.bind(this);
		this.deleteParams = this.deleteParams.bind(this);
	}

	componentDidMount() {
		this.getStorage().then(res => {
			this.setState({ storage: res })
		});
	}

	getStorage() {
		return axios.get('/storage').then(res => {
			return res.data;
		});
	}

	pageSetState(key, value) {
		if(Array.isArray(key)) {
			let state = {};
			key.forEach( (k, i)=> {
				state[k] = value[i];
			});
			this.setState(state);
		} else {
			this.setState({[key]: value})
		}
	}

	formatName(name) {
		return name[0].toUpperCase() + name.substring(1)
	}

	generate(docName) {
		let data = {};
		for (let key in this.state.docxData) {
			data[key] = this.state.docxData[key];
		}
		for (let key in this.state.specData) {
			data[key] = this.state.specData[key];
		}

		return axios({
			method: 'post',
			url: `/generate${this.formatName(docName)}`,
			data: {
				data
			}
		}).then(res=> {
			return res;
		});
	}

	saveParams(){
		axios({
			method: 'post',
			url: '/saveParams',
			data: {
				id: Date.now(),
				docxData: this.state.docxData,
				docxName: this.state.docxName,
				specData: this.state.specData,
				specName: this.state.specName,
				// fileName: this.state[`${this.formatName(docName)}Name`],
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

	download(docName) {
		const url = `/download${this.formatName(docName)}`;
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = `${this.state[`${docName}Name`]}${docName ==='docx' ? '.docx' : '.xlsx'}`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	}

	getDoc(docName) {
		this.generate(docName).then(res => {
			this.download(docName);
		});
	}

	render() {
		return (
			<div className="StartPage">
				<section>
					<Form pageState={this.state} pageSetState={this.pageSetState} saveParams={this.saveParams} getDoc={this.getDoc} />
					<ReportList pageState={this.state} pageSetState={this.pageSetState} deleteParams={this.deleteParams} />
				</section>
				<div style={{borderTop:'4px solid darkgrey'}}>
					<div>этот раздел находится в разработке</div>
					<Table pageState={this.state} pageSetState={this.pageSetState} getDoc={this.getDoc}/>
					<button type="button" onClick={e => this.getDoc('ks2')}>
						Скачать КС-2
					</button>
					<button type="button" onClick={e => this.getDoc('ks3')}>
						Скачать КС-3
					</button>
				</div>
			</div>
		)
	}
}


