import React from "react";
import './Table.scss';
import axios from 'axios';
import params from "../Form/reportParams";
import Row from "./rowClass";
import Subsection from "./subsectionClass";
import Section from "./sectionClass";
import ContentEditable from 'react-contenteditable';

export default class Table extends React.Component {
	constructor(props) {
		super(props);
		this.params = params;
		this.state = {
			sections: [],
			relatedExpanses: null,
			sumPrice: null
		};
	}

	componentDidMount() {
		let sections = [
			new Section([
				new Subsection([
					new Row(1, 'olala', 'шт', 100, 30).structure,
					new Row(43, 'olalala', 'шт', 10, 20).structure
				], 'Монтажные и пусконаладочные работы по разделу 1:').structure,
				new Subsection([
					new Row(42, 'olala2', 'шт', 1, 30).structure,
					new Row(43, 'olalala2', 'шт', 100, 10).structure,
				], 'Оборудование и материалы по разделу 1:').structure
			], 'Раздел 1. Система  автоматической пожарной сигнализации и оповещения и управления эвакуацией людей при пожаре (АПС и СОУЭ)').structure
		];

		const sectionsSumPrice = this.getSumPrice(sections);
		const relatedExpanses = (sectionsSumPrice * 0.08);
		const sumPrice = sectionsSumPrice + relatedExpanses;

		this.setState({
			sections,
			relatedExpanses,
			sumPrice
		})
	}

	getSumPrice(arr) {
		return arr.reduce((acc, val) => {
			return acc + val.sumPrice;
		}, 0);
	}

	handleButtonClick() {
		this.generateSpec().then(res => {
			this.downloadSpec()
		})
	}

	generateSpec() {
		return axios({
			method: 'post',
			url: '/generateSpec',
			data: {
				sections: this.state.sections,
				relatedExpanses: this.state.relatedExpanses,
				sumPrice: this.state.sumPrice,
			}
		}).then(res=> {
			return res;
		});
	}

	downloadSpec() {
		const url = '/downloadSpec';
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = `yhea.xlsx`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	}

	handleTitleChange(e) {
		const [sectionNum, subsectionNum, type] = e.currentTarget.className.split(' ');
		const value = e.target.value;
		// console.log(sectionNum, subsectionNum, type, value);
		const sections = this.state.sections;
		switch (type) {
			case "subsection-title":
				sections[sectionNum].subsections[subsectionNum].title = value;
				break;
			case "section-title":
				sections[sectionNum].title = value;
				break;
			case "subsection-price":
				sections[sectionNum].subsections[subsectionNum].priceRow = value;
				break;
		}
		this.setState({sections});
	}

	handleCellChange(e){
		const [sectionNum, subsectionNum, rowNum, column] = e.currentTarget.className.split(' ');
		let value = e.target.value;
		if(column === 'number' || column === 'quantity' || column === 'unitPrice') value = parseFloat(value);
		// console.log(sectionNum, subsectionNum, rowNum, column, value);
		const sections = this.state.sections;
		sections[sectionNum].subsections[subsectionNum].rows[rowNum][column] = value;

		if(column === 'unitPrice' || column === 'quantity') {
			this.updateRowSumPrice(sectionNum, subsectionNum, rowNum, sections)
		} else {
			this.setState({sections});
		}
	}

	handleCrossClick(e){
		const [crossType, sectionNum, subsectionNum, rowNum] = e.currentTarget.className.split(' ');
		let sections = this.state.sections;
		switch (crossType) {
			case 'delete-row':
				let rows = sections[sectionNum].subsections[subsectionNum].rows;
				if(rows.length === 1) return;
				rows.splice(rowNum, 1);
				break;
			case 'delete-section':
				if(sections.length === 1) return;
				sections.splice(sectionNum, 1);
				break
		}
		this.setState({sections});
	}

	updateRowSumPrice(sectionNum, subsectionNum, rowNum, sections) {
		if(!sections) sections = this.state.sections;
		const section = sections[sectionNum];
		const subsection = section.subsections[subsectionNum];
		const row = subsection.rows[rowNum];
		row.sumPrice = row.quantity * row.unitPrice;
		subsection.sumPrice = this.getSumPrice(subsection.rows);
		section.sumPrice = this.getSumPrice(section.subsections);

		this.setState(
			{sections},
			() => {
				this.updateSumPrices();
			}
		)
	}

	updateSumPrices() {
		const sectionsSumPrice = this.getSumPrice(this.state.sections);
		const relatedExpanses = (sectionsSumPrice * 0.08);
		const sumPrice = sectionsSumPrice + relatedExpanses;

		this.setState({
			relatedExpanses,
			sumPrice
		})
	}

	getSubsections(sectionNum) {
		// const section = this.state.sections[sectionNum];
		return this.state.sections[sectionNum].subsections.map((subsection, subsectionNum) => {
			const key = `${sectionNum} ${subsectionNum}`;
			return (
				<>
					<tr key={`${key} subtitle`}>
						<th colSpan="6"><input className={`${key} subsection-title table-input`} onChange={e => this.handleTitleChange(e)} value={subsection?.title || ''} /></th>
					</tr>
					{
						this.getRows(sectionNum, subsectionNum)
					}
					<tr key={`${key} addRow`}><td colSpan='6'><button type='button' onClick={e => this.addRow(sectionNum, subsectionNum)}>Добавить строку</button></td></tr>
					<tr key={`${key} subprice`}>
						<td colSpan='5'><input className={`${key} subsection-price table-input`} onChange={e => this.handleTitleChange(e)} value={subsection?.priceRow || ''} /></td><td>{subsection.sumPrice?.toFixed(2)}</td>
					</tr>
				</>
			)
		})
	}

	getRows(sectionNum, subsectionNum) {
		// const subsection = this.state.sections[sectionNum].subsections[subsectionNum];
		return this.state.sections[sectionNum].subsections[subsectionNum].rows.map((row, rowNum) => {
			const key = `${sectionNum} ${subsectionNum} ${rowNum}`;
			return (
				<tr key={key}>
					<td><input className={`${key} number table-input`} onChange={e => this.handleCellChange(e)} value={parseFloat(row?.number) || ''} /> </td>
					<td><textarea className={`${key} name table-input`} onChange={e => this.handleCellChange(e)} value={row?.name || ''}> </textarea></td>
					<td><input className={`${key} measure table-input`} onChange={e => this.handleCellChange(e)} value={row?.measure || ''} /> </td>
					<td><input className={`${key} quantity table-input`} onChange={e => this.handleCellChange(e)} value={parseFloat(row?.quantity) || ''} /> </td>
					<td><input className={`${key} unitPrice table-input`} onChange={e => this.handleCellChange(e)} value={parseFloat(row?.unitPrice) || ''} /> </td>
					<td>{row?.sumPrice.toFixed(2)}<div className={`delete-row ${key} cross`} onClick={e => this.handleCrossClick(e)}>x</div></td>
				</tr>
			)
		})
	}

	addSection() {
		let sections = this.state.sections;
		sections.push(
			new Section([
				new Subsection([
					new Row('', '', '', 0, 0).structure,
				], 'Монтажные и пусконаладочные работы по разделу :').structure,
				new Subsection([
					new Row('', '', '', 0, 0).structure,
				], 'Оборудование и материалы по разделу :').structure
			], 'Раздел').structure
		);

		this.setState({sections})
	}

	addRow(sectionNum, subsectionNum) {
		let sections = this.state.sections;
		sections[sectionNum].subsections[subsectionNum].rows.push(new Row( '', '', '', 0, 0).structure);

		this.setState({sections})
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
							<th>Цена за единицу, руб.</th>
							<th>Стоимость, руб.</th>
						</tr>
					</thead>
						{
							this.state.sections.map((section, sectionNum) => {
								return (
									<tbody key={`section${sectionNum}`}>
										<tr>
											<th colSpan="6"><input className={`${sectionNum} ${null} section-title table-input`} onChange={e => this.handleTitleChange(e)} value={section?.title || ''} /><div className={`delete-section ${sectionNum} ${null} ${null} cross`} onClick={e => this.handleCrossClick(e)}>x</div></th>
										</tr>
										{this.getSubsections(sectionNum)}
									</tbody>
								)
							})
						}
					<tbody>
						<tr><td colSpan='6'><button	type='button'	disabled={this.state.sections.length === 8} onClick={e => this.addSection()}>Добавить раздел</button></td></tr>
					</tbody>
					<tfoot>
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