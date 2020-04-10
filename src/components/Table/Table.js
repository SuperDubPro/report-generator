import React from "react";
import './Table.scss';
import axios from 'axios';
import params from "../Form/reportParams";
import Row from "./rowClass";
import ContentEditable from 'react-contenteditable';


export default class Table extends React.Component {
	constructor(props) {
		super(props);
		this.params = params;
		this.state = {
			firstSection: [],
			secondSection: [],
			firstSectionPrice: null,
			secondSectionPrice: null,
			relatedExpanses: null,
			sumPrice: null
		};
	}

	componentDidMount() {
		const firstSection = [
			new Row(1, 'olala', 'шт', 111, 30).structure,
			new Row(43, 'olalala', 'шт', 112, 20).structure,
		];
		const secondSection = [
			new Row(42, 'olala2', 'шт', 111, 30).structure,
			new Row(43, 'olalala2', 'шт', 112, 10).structure,
		];
		const firstSectionPrice = this.getSectionPrice(firstSection);
		const secondSectionPrice = this.getSectionPrice(secondSection);
		const sectionsSumPrice = firstSectionPrice + secondSectionPrice;
		const relatedExpanses = (sectionsSumPrice * 0.08);
		const sumPrice = sectionsSumPrice + relatedExpanses;

		this.setState({
			firstSection,
			secondSection,
			firstSectionPrice,
			secondSectionPrice,
			relatedExpanses,
			sumPrice
		})
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		// if(prevState.firstSection !== this.state.firstSection) {
		// 	this.handleSectionChange('firstSection')
		// }
		// if(prevState.secondSection !== this.state.secondSection) {
		// 	this.handleSectionChange('secondSection')
		// }
	}

	// handleSectionChange(section) {
	// 	const firstSectionPrice = section === 'firstSection' ? this.getSectionPrice(this.state[section]) : (this.state.firstSectionPrice || 0);
	// 	const secondSectionPrice = section === 'secondSection' ? this.getSectionPrice(this.state[section]) : (this.state.secondSectionPrice || 0);
	// 	const sectionsSumPrice = firstSectionPrice + secondSectionPrice;
	// 	const relatedExpanses = (sectionsSumPrice * 0.08);
	// 	const sumPrice = sectionsSumPrice + relatedExpanses;
	//
	// 	if (firstSectionPrice){
	// 		this.setState({
	// 			firstSectionPrice,
	// 			relatedExpanses,
	// 			sumPrice
	// 		})
	// 	} else {
	// 		this.setState({
	// 			secondSectionPrice,
	// 			relatedExpanses,
	// 			sumPrice
	// 		})
	// 	}
	// }

	getSectionPrice(arr) {
		return arr.reduce((acc, val) => {
			return acc + val.sumPrice;
		}, 0);
	}

	handleButtonClick() {
		this.generateXlsx().then(res => {
			this.downloadXlsx()
		})
	}

	getFixedSection(section) {
		return this.state[section].map(row => {
			row.unitPrice = row.unitPrice.toFixed(2);
			row.sumPrice = row.sumPrice.toFixed(2);
			return row;
		})
	}

	generateXlsx() {
		return axios({
			method: 'post',
			url: '/generateXlsx',
			data: {
				data: {
					// firstSection: this.getFixedSection('firstSection'),
					firstSection: this.state.firstSection,
					// secondSection: this.getFixedSection('secondSection'),
					secondSection: this.state.secondSection,
					firstSectionPrice: this.state.firstSectionPrice,
					secondSectionPrice: this.state.secondSectionPrice,
					relatedExpanses: this.state.relatedExpanses,
					sumPrice: this.state.sumPrice,
				}
			}
		}).then(res=> {
			return res;
		});
	}

	downloadXlsx() {
		const url = '/downloadXlsx';
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = `yhea.xlsx`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	}

	// handleCellChange(e){
	// 	const [sectionName, row, column] = e.currentTarget.className.split(' ');
	// 	console.log(e.target.value);
	// 	const r = e.target.value.match(/>(.*)</);
	// 	console.log(r);
	// 	let value = r[1];
	//
	// 	let sectionVal = this.state[sectionName];
	// 	sectionVal[row][column] = value === '<br>' ? '' : value ;
	//
	// 	this.setState({
	// 		[sectionName]: sectionVal
	// 	});
	// }

	handleCellChange(e){
		const [sectionName, row, column] = e.currentTarget.className.split(' ');
		const value = e.target.value;
		let section = this.state[sectionName];
		section[row][column] = value;

		this.setState(
			{[sectionName]: section},
			() => {
				if(column === 'unitPrice' || column === 'quantity') {
					this.updateRowSumPrice(sectionName, row);
				}
			}
		);
	}

	updateRowSumPrice(sectionName, rowNum) {
		let section = this.state[sectionName];
		let row = section[rowNum];
		const quantity = row.quantity;
		const unitPrice = row.unitPrice;
		row.sumPrice = quantity * unitPrice;
		section[rowNum] = row;

		this.setState(
			{[sectionName]: section},
			() => {
				this.updateSumPrices();
			}
		)
	}

	updateSumPrices() {
		const firstSectionPrice = this.getSectionPrice(this.state.firstSection);
		const secondSectionPrice = this.getSectionPrice(this.state.secondSection);
		const sectionsSumPrice = firstSectionPrice + secondSectionPrice;
		const relatedExpanses = (sectionsSumPrice * 0.08);
		const sumPrice = sectionsSumPrice + relatedExpanses;

		this.setState({
			firstSectionPrice,
			secondSectionPrice,
			relatedExpanses,
			sumPrice
		})
	}

	getRows(sectionName) {
		return this.state[sectionName].map((row, rowNum) => {
			return (
				<tr key={`${sectionName} ${rowNum}`}>
					<td><input className={`${sectionName} ${rowNum} number table-input`} onChange={e => this.handleCellChange(e)} value={parseFloat(row?.number) || ''} /> </td>
					<td><textarea className={`${sectionName} ${rowNum} name table-input`} onChange={e => this.handleCellChange(e)} value={row?.name || ''}> </textarea></td>
					<td><input className={`${sectionName} ${rowNum} measure table-input`} onChange={e => this.handleCellChange(e)} value={row?.measure || ''} /> </td>
					<td><input className={`${sectionName} ${rowNum} quantity table-input`} onChange={e => this.handleCellChange(e)} value={parseFloat(row?.quantity) || ''} /> </td>
					<td><input className={`${sectionName} ${rowNum} unitPrice table-input`} onChange={e => this.handleCellChange(e)} value={parseFloat(row?.unitPrice) || ''} /> </td>
					<td>{row?.sumPrice}</td>
				</tr>
			)
		})
	}

	addRow(sectionName) {
		let section = this.state[sectionName];
		let number = section.length + 1;
		if (sectionName === 'secondSection') number = number + this.state.firstSection.length;

		section.push(new Row(number, '', '', 0, 0));

		this.setState({
			[sectionName]: section
		})
	}

	render() {
		return (
			<>
				<table>
					<thead>
						<tr>
							<th>№п/п</th>
							<th>Наименование работ и материалов</th>
							<th>Единица измерения</th>
							<th>Кол-во</th>
							<th>"Цена за единицу, руб."</th>
							<th>Стоимость, руб.</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th colSpan="6">
								Раздел 1. Система  автоматической пожарной сигнализации и оповещения и управления эвакуацией людей при пожаре (АПС и СОУЭ)
							</th>
						</tr>
						<tr>
							<th colSpan="6">
								Монтажные и пусконаладочные работы по разделу 1:
							</th>
						</tr>
						{this.getRows('firstSection')}
						<tr><td colSpan='6'><button type='button' onClick={e => this.addRow('firstSection')}>Добавить строку</button></td></tr>
						<tr><td colSpan='5'>Итого по Разделу 1 за программирование,  монтажные и пусконаладочные работы:</td><td>{this.state.firstSectionPrice?.toFixed(2)}</td></tr>
					</tbody>
					<tbody>
					<tr>
						<th colSpan="6">
							Оборудование и материалы по разделу 1:
						</th>
					</tr>
					{this.getRows('secondSection')}
					<tr><td colSpan='6'><button type='button' onClick={e => this.addRow('secondSection')}>Добавить строку</button></td></tr>
					<tr><td colSpan='5'>Итого по Разделу 1 за оборудование и материалы:</td><td>{this.state.secondSectionPrice?.toFixed(2)}</td></tr>
					</tbody>
					<tfoot>
						<tr><th colSpan='5'>Итого по смете за монтажные и пусконаладочные работы:</th><th>{this.state.firstSectionPrice?.toFixed(2)}</th></tr>
						<tr><th colSpan='5'>Итого по смете за оборудование и материалы:</th><th>{this.state.secondSectionPrice?.toFixed(2)}</th></tr>
						<tr><th colSpan='5'>Накладные и транспортные расходы:</th><th>{this.state.relatedExpanses?.toFixed(2)}</th></tr>
						<tr><th colSpan='5'>Итого по смете:</th><th>{this.state.sumPrice?.toFixed(2)}</th></tr>
					</tfoot>
				</table>
				<button
					type="button"
					onClick={e => this.handleButtonClick()}
				>
					Скачать xlsx
				</button>
			</>
		)
	}
}