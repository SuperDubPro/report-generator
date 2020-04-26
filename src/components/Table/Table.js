import React from "react";
import './Table.scss';
import Row from "./rowClass";
import Subsection from "./subsectionClass";
import Section from "./sectionClass";
import ContentEditable from 'react-contenteditable';

export default class Table extends React.Component {
	// constructor(props) {
	// 	super(props);
	// 	this.params = params;
	// 	this.state = {
	// 		sections: [],
	// 		relatedExpanses: null,
	// 		sumPrice: null
	// 	};
	// }

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

		const specData = {
			sections,
			relatedExpanses,
			sumPrice
		};

		this.props.pageSetState('specData', specData)
	}

	getSumPrice(arr) {
		return arr.reduce((acc, val) => {
			return acc + val.sumPrice;
		}, 0);
	}

	getCellVal(e) {
		const r = e.target.value.match(/>(.*)</);
		// console.log(r);
		let value;
		if(r) {

			value = r[1];
		} else {
			value = e.target.value;
		}
		return value
	}

	//используется в getEditableContentTag
	handleTitleChange(e) {
		const [sectionNum, subsectionNum, type] = e.currentTarget.className.split(' ');
		// const value = e.target.value;
		const value = this.getCellVal(e);

		// console.log(e.currentTarget.focus);
		// e.currentTarget.focus

		const specData = this.props.pageState.specData;
		const sections = specData.sections;
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
		specData.sections = sections;
		this.props.pageSetState('specData', specData);
	}

	//используется в getEditableContentTag
	handleCellChange(e){
		const [sectionNum, subsectionNum, rowNum, column] = e.currentTarget.className.split(' ');
		// let value = e.target.value;
		let value = this.getCellVal(e);


		if(column === 'number' || column === 'quantity' || column === 'unitPrice') value = parseFloat(value);
		// console.log(sectionNum, subsectionNum, rowNum, column, value);

		const specData = this.props.pageState.specData;
		const sections = specData.sections;
		sections[sectionNum].subsections[subsectionNum].rows[rowNum][column] = value;

		if(column === 'unitPrice' || column === 'quantity') {
			this.updateRowSumPrice(sectionNum, subsectionNum, rowNum, sections)
		} else {
			specData.sections = sections;
			this.props.pageSetState('specData', specData);
		}
	}

	handleCrossClick(e){
		const [crossType, sectionNum, subsectionNum, rowNum] = e.currentTarget.className.split(' ');
		const specData = this.props.pageState.specData;
		const sections = specData.sections;
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
		specData.sections = sections;
		this.props.pageSetState('specData', specData);
	}

	updateRowsNumber(){

	}

	updateRowSumPrice(sectionNum, subsectionNum, rowNum, sections) {
		const specData = this.props.pageState.specData;
		if(!sections) sections = specData.sections;
		// if(!sections) sections = this.state.sections;

		const section = sections[sectionNum];
		const subsection = section.subsections[subsectionNum];
		const row = subsection.rows[rowNum];
		row.sumPrice = row.quantity * row.unitPrice;
		subsection.sumPrice = this.getSumPrice(subsection.rows);
		section.sumPrice = this.getSumPrice(section.subsections);

		const [relatedExpanses, sumPrice] = this.getUpdatedSumPrices(sections);
		specData.relatedExpanses = relatedExpanses;
		specData.sumPrice = sumPrice;

		this.props.pageSetState('specData', specData)
	}

	getUpdatedSumPrices(sections) {
		const sectionsSumPrice = this.getSumPrice(sections);
		const relatedExpanses = (sectionsSumPrice * 0.08);
		const sumPrice = sectionsSumPrice + relatedExpanses;
		return [relatedExpanses, sumPrice]
	}

	getSubsections(sectionNum) {
		const specData = this.props.pageState.specData;
		const sections = specData.sections;
		return sections[sectionNum].subsections.map((subsection, subsectionNum) => {
			const key = `${sectionNum} ${subsectionNum}`;
			return (
				<>
					<tr key={`${key} subtitle`}>
						{/*<th colSpan="6"><input className={`${key} subsection-title table-input`} onChange={e => this.handleTitleChange(e)} value={subsection?.title || ''} /></th>*/}
						<th colSpan="6">{this.getEditableContentTag(subsection.title, `${key} subsection-title table-input`, 'Title')}</th>
					</tr>
					{
						this.getRows(sectionNum, subsectionNum)
					}
					<tr key={`${key} addRow`}><td colSpan='6'><button type='button' onClick={e => this.addRow(sectionNum, subsectionNum)}>Добавить строку</button></td></tr>
					<tr key={`${key} subprice`}>
						{/*<td colSpan='5'><input className={`${key} subsection-price table-input`} onChange={e => this.handleTitleChange(e)} value={subsection?.priceRow || ''} /></td><td>{subsection.sumPrice?.toFixed(2)}</td>*/}
						<td colSpan='5'>{this.getEditableContentTag(subsection.priceRow, `${key} subsection-price table-input`, 'Title')}</td><td>{subsection.sumPrice?.toFixed(2)}</td>
					</tr>
				</>
			)
		})
	}

	getRows(sectionNum, subsectionNum) {
		const specData = this.props.pageState.specData;
		const sections = specData.sections;
		return sections[sectionNum].subsections[subsectionNum].rows.map((row, rowNum) => {
			const key = `${sectionNum} ${subsectionNum} ${rowNum}`;
			return (
				<tr key={key}>
					{/*<td><input className={`${key} number table-input`} onChange={e => this.handleCellChange(e)} value={parseFloat(row?.number) || ''} /> </td>*/}
					{/*<td><textarea className={`${key} name table-input`} onChange={e => this.handleCellChange(e)} value={row?.name || ''}> </textarea></td>*/}
					{/*<td><input className={`${key} measure table-input`} onChange={e => this.handleCellChange(e)} value={row?.measure || ''} /> </td>*/}
					{/*<td><input className={`${key} quantity table-input`} onChange={e => this.handleCellChange(e)} value={parseFloat(row?.quantity) || ''} /> </td>*/}
					{/*<td><input className={`${key} unitPrice table-input`} onChange={e => this.handleCellChange(e)} value={parseFloat(row?.unitPrice) || ''} /> </td>*/}
					<td>{this.getEditableContentTag(row.number, `${key} number table-input`, 'Cell', parseFloat(row?.number) || '')}</td>
					<td>{this.getEditableContentTag(row.name, `${key} name table-input`, 'Cell')}</td>
					<td>{this.getEditableContentTag(row.measure, `${key} measure table-input`, 'Cell')}</td>
					<td>{this.getEditableContentTag(row.quantity, `${key} quantity table-input`, 'Cell', parseFloat(row?.quantity) || '')}</td>
					<td>{this.getEditableContentTag(row.unitPrice, `${key} unitPrice table-input`, 'Cell', parseFloat(row?.unitPrice) || '')}</td>
					<td>{row?.sumPrice.toFixed(2)}<div className={`delete-row ${key} cross`} onClick={e => this.handleCrossClick(e)}>x</div></td>
				</tr>
			)
		})
	}

	getEditableContentTag(variable, className, type, value) {
		if(!value) value = variable;
		return (
			variable &&
			<ContentEditable className={className} onChange={eval(`e => this.handle${type}Change(e)`)} id={className} html={`<div>${value? value : ''}</div>`} />
		) || (
			<input className={className} onChange={eval(`e => this.handle${type}Change(e)`)} value={value? value : ''} autoFocus={true} />
		)
	}

	addSection() {
		const specData = this.props.pageState.specData;
		const sections = specData.sections;
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

		specData.sections = sections;
		this.props.pageSetState('specData', specData);
	}

	addRow(sectionNum, subsectionNum) {
		const specData = this.props.pageState.specData;
		const sections = specData.sections;
		sections[sectionNum].subsections[subsectionNum].rows.push(new Row( '', '', '', 0, 0).structure);

		specData.sections = sections;
		this.props.pageSetState('specData', specData);
	}

	render() {
		const specData = this.props.pageState.specData;
		const sections = specData.sections || [];

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
							sections.map((section, sectionNum) => {
								const className = `${sectionNum} ${null} section-title table-input`;
								return (
									<tbody key={`section${sectionNum}`}>
										<tr>
											{/*<th colSpan="6"><input className={`${sectionNum} ${null} section-title table-input`} onChange={e => this.handleTitleChange(e)} value={section?.title || ''} /><div className={`delete-section ${sectionNum} ${null} ${null} cross`} onClick={e => this.handleCrossClick(e)}>x</div></th>*/}
											<th colSpan="6">
												{this.getEditableContentTag(section.title, className, 'Title')}
												<div className={`delete-section ${sectionNum} ${null} ${null} cross`} onClick={e => this.handleCrossClick(e)}>x</div>
											</th>
										</tr>
										{this.getSubsections(sectionNum)}
									</tbody>
								)
							})
						}
					<tbody>
						<tr><td colSpan='6'><button	type='button'	disabled={sections.length === 8} onClick={e => this.addSection()}>Добавить раздел</button></td></tr>
					</tbody>
					<tfoot>
						<tr><th colSpan='5'>Накладные и транспортные расходы:</th><th>{specData.relatedExpanses?.toFixed(2)}</th></tr>
						<tr><th colSpan='5'>Итого по смете:</th><th>{specData.sumPrice?.toFixed(2)}</th></tr>
					</tfoot>
				</table>
				<button
					type="button"
					onClick={e => this.props.getDoc('spec')}
				>
					Скачать спецификацию
				</button>
			</>
		)
	}
}