import React from "react";
import './Table.scss';

import Row from "./rowClass";
import Subsection from "./subsectionClass";
import Section from "./sectionClass";

import { default as Icon } from '../Icon';
import ContentEditable from 'react-contenteditable';

const TAX = 0.20;
// const RELATED_EXPANSES = 0.08;
const MAX_SECTIONS_LENGTH = 8;

export default class Table extends React.Component {

	componentDidMount() {
		let sections = [
			new Section([
				new Subsection([
					new Row(1, 'название', 'шт', 1, 1),
				], 'Монтажные и пусконаладочные работы по разделу 1:'),
				new Subsection([
					new Row(2, 'название', 'шт', 1, 1),
				], 'Оборудование и материалы по разделу 1:')
			], 'Раздел 1. Система  автоматической пожарной сигнализации и оповещения и управления эвакуацией людей при пожаре (АПС и СОУЭ)')
		];

		const sectionsSumPrice = this.getSumPrice(sections);
		const sectionsSumPriceInWords = this.getNumInWords(sectionsSumPrice);
		const relatedExpanses = this.getSumPrice(sections,'relatedExpanses');
		const sumPriceTaxFree = sectionsSumPrice + relatedExpanses;
		const sumPriceTaxFreeInWords = this.getNumInWords(sumPriceTaxFree);
		const tax = sumPriceTaxFree * TAX;
		const taxInWords = this.getNumInWords(tax) || '';
		const sumPrice = sectionsSumPrice + relatedExpanses + tax;
		const sumPriceInWords = this.getNumInWords(sumPrice) || '';
		const sumPriceHALF = this.getNumHalf(sumPrice,'big') || '';
		const sumPriceHalf = this.getNumHalf(sumPrice,'small') || '';
		const sumPriceHALFInWords = this.getNumInWords(sumPriceHALF) || '';
		const sumPriceHalfInWords = this.getNumInWords(sumPriceHalf) || '';
		const itemsQuantity = this.getItemsQuantity(sections);

		const specData = {
			sections,
			sectionsSumPrice,
			sectionsSumPriceInWords,
			relatedExpanses,
			sumPrice,
			sumPriceInWords,
			tax,
			taxInWords,
			sumPriceTaxFree,
			sumPriceTaxFreeInWords,
			sumPriceHALF,
			sumPriceHalf,
			sumPriceHALFInWords,
			sumPriceHalfInWords,
			itemsQuantity,
		};

		this.props.pageSetState('specData', specData)
	}

	getSumPrice(arr, key) {
		if(!key) key = 'sumPrice';
		return arr.reduce((acc, val) => {
			return acc + val[key];
		}, 0);
	}

	getNumInWords(a) {
		if(!a) return;
		a = a.toString().replace(',','.');
		a = Number(a).toFixed(2).split('.');  // округлить до сотых и сделать массив двух чисел: до точки и после неё

		function num_letters(k, d) {  // целое число прописью, это основа
			let i = '', e = [
				['','тысяч','миллион','миллиард','триллион','квадриллион','квинтиллион','секстиллион','септиллион','октиллион','нониллион','дециллион'],
				['а','и',''],
				['','а','ов']
			];

			if (k === '' || k === '0') return ' ноль'; // 0
			k = k.split(/(?=(?:\d{3})+$)/);  // разбить число в массив с трёхзначными числами
			if (k[0].length === 1) k[0] = '00'+k[0];
			if (k[0].length === 2) k[0] = '0'+k[0];

			// console.log('1k: ', k);
			for (let j = (k.length - 1); j >= 0; j--) {  // соединить трёхзначные числа в одно число, добавив названия разрядов с окончаниями
				if (k[j] !== '000') {
					i = (((d && j === (k.length - 1)) || j === (k.length - 2)) && (k[j][2] === '1' || k[j][2] === '2') ? t(k[j],1) : t(k[j])) + declOfNum(k[j], e[0][k.length - 1 - j], (j === (k.length - 2) ? e[1] : e[2])) + i;
				}
			}

			return i;
		}

		function t(k, d) {  // преобразовать трёхзначные числа
			let e = [
				['',' один',' два',' три',' четыре',' пять',' шесть',' семь',' восемь',' девять'],
				[' десять',' одиннадцать',' двенадцать',' тринадцать',' четырнадцать',' пятнадцать',' шестнадцать',' семнадцать',' восемнадцать',' девятнадцать'],
				['','',' двадцать',' тридцать',' сорок',' пятьдесят',' шестьдесят',' семьдесят',' восемьдесят',' девяносто'],
				['',' сто',' двести',' триста',' четыреста',' пятьсот',' шестьсот',' семьсот',' восемьсот',' девятьсот'],
				['',' одна',' две']
			];
			return e[3][k[0]] + (k[1] === "1" ? e[1][k[2]] : e[2][k[1]] + (d ? e[4][k[2]] : e[0][k[2]]));
		}

		function declOfNum(n, t, o) {  // склонение именительных рядом с числительным: число (typeof = string), корень (не пустой), окончание
			// if(!n || !t || !o) return;
			let k = [2,0,1,1,1,2,2,2,2,2];
			return (t === '' ? '' : ' ' + t + (n[n.length-2] === "1" ? o[2] : o[k[n[n.length-1]]]));
		}

		function razUp(e) {  // сделать первую букву заглавной и убрать лишний первый пробел
			return a[0] + ' (' + e[1].toUpperCase() + e.substring(2);
		}

		return razUp(num_letters(a[0]) + ')' + declOfNum(a[0], 'рубл', ['ь','я','ей']) + ' ' + a[1] + declOfNum(a[1], 'копе', ['йка','йки','ек']));
	}

	getNumHalf(num, type){
		num = num * 100;
		if(num % 2) {
			if(type === 'big') {
				num = Math.ceil(num/2);
			}
			if(type === 'small') {
				num = Math.floor(num/2);
			}
			return num/100
		} else {
			return num / 200;
		}
	}

	getItemsQuantity(sections) {
		let q = 0;
		sections.forEach(section => {
			++q; //в КС в каждой секции есть строка накладные и транспортные расходы
			section.subsections.forEach(subsection => {
				subsection.rows.forEach(row => {
					++q;
				})
			})
		});
		return q;
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

	handleCellChange(e){
		const [sectionNum, subsectionNum, rowNum, column] = e.currentTarget.className.split(' ');
		let value = this.getCellVal(e);
		const specData = this.props.pageState.specData;
		const section = specData.sections[sectionNum] || null;
		const subsection = section?.subsections[subsectionNum] || null;
		const row = subsection?.rows[rowNum] || null;

		switch (column) {
			case 'number':
			case 'quantity':
			case 'unitPrice':
				if(value[value.length-1] === '.') return;
				// if(value[value.length-1] === ',') return;
				// if(value[value.length-2] === ',') {
				// 	const i = value.length-2;
				// 	let arr = value.split('');
				// 	arr[i] = '.';
				// 	value[i] = arr.join('');
				// 	return;
				// }
				value = parseFloat(value);
			case 'measure':
			case 'name':
				row[column] = value;
				break;
			case 'subsection-title':
				subsection.title = value;
				break;
			case 'section-title':
				section.title = value;
				break;
			case 'subsection-price':
				subsection.priceRow = value;
				break;
			case 'section-price':
				section.priceRow = value;
			case 'relatedExpansesPerc':
				if(value[value.length-1] === '.') return;
				section.relatedExpansesPerc = parseFloat(value);
				this.updateSectionSumPrice(section);
				this.updateSumPrices(specData);
				break;
		}

		if(column === 'unitPrice' || column === 'quantity') {
			this.updateRowSumPrice(row);
			this.updateSubsectionSumPrice(subsection);
			this.updateSectionSumPrice(section);
			this.updateSumPrices(specData)
		}

		this.props.pageSetState('specData', specData);
	}

	handleCrossClick(e){
		const [crossType, sectionNum, subsectionNum, rowNum] = e.currentTarget.className.split(' ');
		const specData = this.props.pageState.specData;
		const sections = specData.sections;
		const section = specData.sections[sectionNum] || null;
		const subsection = section?.subsections[subsectionNum] || null;
		const rows = subsection?.rows || null;

		switch (crossType) {
			case 'delete-row':
				if(rows.length === 1) return;
				rows.splice(rowNum, 1);
				this.updateSubsectionSumPrice(subsection);
				this.updateSectionSumPrice(section);
				this.updateSumPrices(specData);
				break;
			case 'delete-section':
				if(sections.length === 1) return;
				sections.splice(sectionNum, 1);
				this.updateSumPrices(specData);
				break
		}

		this.updateRowsNumber(specData.sections);
		this.props.pageSetState('specData', specData);
	}

	updateRowsNumber(sections){
		let rowNum = 0;
		sections.forEach(section => {
			section.subsections.forEach(subsection => {
				subsection.rows.forEach(row => {
					row.number = ++rowNum;
				})
			})
		});
	}

	addSection() {
		const specData = this.props.pageState.specData;
		specData.sections.push(
			new Section(
				[
					new Subsection(
						[
							new Row(0, 'название', 'шт', 1, 1),
						],
						'Подраздел:',
						'Итого'
					),
					new Subsection(
						[
							new Row(0, 'название', 'шт', 1, 1),
						],
						'Подраздел:',
						'Итого:'
					)
				],
				'Раздел',
				'Итого по разделу'
			)
		);

		this.updateSumPrices(specData);
		this.updateRowsNumber(specData.sections);
		this.props.pageSetState('specData', specData);
	}

	addRow(sectionNum, subsectionNum) {
		const specData = this.props.pageState.specData;
		const section = specData.sections[sectionNum];
		const subsection = section.subsections[subsectionNum];
		const rows = subsection.rows;
		const newRowNum = rows.length;
		rows.push(new Row( 0, 'название', 'шт', 1, 1));

		this.updateRowSumPrice(rows[newRowNum]);
		this.updateSubsectionSumPrice(subsection);
		this.updateSectionSumPrice(section);
		this.updateSumPrices(specData);
		this.updateRowsNumber(specData.sections);
		this.props.pageSetState('specData', specData);
	}

	updateSumPrices(data) {
		data.sectionsSumPrice = this.getSumPrice(data.sections);
		data.sectionsSumPriceInWords = this.getNumInWords(data.sectionsSumPrice);
		// data.relatedExpanses = data.sectionsSumPrice * this.state.relatedExpanses;
		data.relatedExpanses = this.getSumPrice(data.sections,'relatedExpanses');
		data.sumPriceTaxFree = data.sectionsSumPrice + data.relatedExpanses;
		data.sumPriceTaxFreeInWords = this.getNumInWords(data.sumPriceTaxFree);
		data.tax = data.sumPriceTaxFree * TAX;
		data.taxInWords = this.getNumInWords(data.tax) || '';
		data.sumPrice = data.sectionsSumPrice + data.relatedExpanses + data.tax;
		data.sumPriceInWords = this.getNumInWords(data.sumPrice) || '';
		data.sumPriceHALF = this.getNumHalf(data.sumPrice,'big') || '';
		data.sumPriceHalf = this.getNumHalf(data.sumPrice,'small') || '';
		data.sumPriceHALFInWords = this.getNumInWords(data.sumPriceHALF) || '';
		data.sumPriceHalfInWords = this.getNumInWords(data.sumPriceHalf) || '';
		data.itemsQuantity = this.getItemsQuantity(data.sections);
	}

	updateSectionSumPrice(section) {
		section.subsectionsSumPrice = this.getSumPrice(section.subsections);
		section.relatedExpanses = section.subsectionsSumPrice * section.relatedExpansesPerc / 100;
		section.sumPrice = section.subsectionsSumPrice + section.relatedExpanses;
	}

	updateSubsectionSumPrice(subsection) {
		subsection.sumPrice = this.getSumPrice(subsection.rows)
	}

	updateRowSumPrice(row) {
		row.sumPrice = row.quantity * row.unitPrice;
	}

	getCrossCell(className) {
		return (
			<td className={`cross-cell`}>
				<div className={`${className} cross`} onClick={e => this.handleCrossClick(e)}>
					{
						className &&
						<Icon name='cross' />
					}
				</div>
			</td>
		)
	}

	getSubsections(sectionNum) {
			const specData = this.props.pageState.specData;
			const sections = specData.sections;
			return sections[sectionNum].subsections.map((subsection, subsectionNum) => {
			const key = `${sectionNum} ${subsectionNum} ${null}`;
			return (
				<>
					<tr key={`${key} subtitle`}>
						<th colSpan="6">{this.getEditableContentTag(subsection.title, `${key} subsection-title table-input`)}</th>
						{this.getCrossCell()}
					</tr>
					{
						this.getRows(sectionNum, subsectionNum)
					}
					<tr key={`${key} addRow`}>
						<td colSpan='6'><button type='button' onClick={e => this.addRow(sectionNum, subsectionNum)}>Добавить строку</button></td>
						{this.getCrossCell()}
					</tr>
					<tr key={`${key} subprice`}>
						<td colSpan='5'>{this.getEditableContentTag(subsection.priceRow, `${key} subsection-price table-input`)}</td><td>{subsection.sumPrice?.toFixed(2)}</td>
						{this.getCrossCell()}
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
					<td>{this.getEditableContentTag(row.number, `${key} number table-input`, row?.number || '')}</td>
					<td>{this.getEditableContentTag(row.name, `${key} name table-input`)}</td>
					<td>{this.getEditableContentTag(row.measure, `${key} measure table-input`)}</td>
					<td>{this.getEditableContentTag(row.quantity, `${key} quantity table-input`, row?.quantity || '')}</td>
					<td>{this.getEditableContentTag(row.unitPrice, `${key} unitPrice table-input`, row?.unitPrice || '')}</td>
					<td>{row?.sumPrice.toFixed(2)}</td>
					{this.getCrossCell(`delete-row ${key}`)}
				</tr>
			)
		})
	}

	getEditableContentTag(variable, className, value) {
		if(!value) value = variable;
		return (
			<ContentEditable
				className={className}
				onChange={e => this.handleCellChange(e)}
				id={className}
				html={
					variable
						? `<div>${value ? value : ' '}</div>`
						: `<br/>`
				}
			/>
		)
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
							{this.getCrossCell()}
						</tr>
					</thead>
						{
							sections.map((section, sectionNum) => {
								const className = `${sectionNum} ${null} ${null} section-title table-input`;
								return (
									<tbody key={`section${sectionNum}`}>
										<tr>
											<th colSpan="6">{this.getEditableContentTag(section.title, className)}</th>
											{this.getCrossCell(`delete-section ${sectionNum} ${null} ${null}`)}
										</tr>
										{this.getSubsections(sectionNum)}
										<tr>
											<th colSpan='5' className='align-left'>Стоимость работ:</th><th>{section.subsectionsSumPrice?.toFixed(2)}</th>
											{this.getCrossCell()}
										</tr>
										<tr>
											<th colSpan='2' className='align-left'>Сопутствующие расходы %:</th><th >{this.getEditableContentTag(section.relatedExpansesPerc, `${sectionNum} ${null} ${null} relatedExpansesPerc table-input`)}</th>
											<th colSpan='2' className='align-left'>Сопутствующие расходы:</th><th >{section.relatedExpanses?.toFixed(2)}</th>
											{this.getCrossCell()}
										</tr>
										<tr>
											<th colSpan='5'>{this.getEditableContentTag(section.priceRow, `${sectionNum} ${null} ${null} section-price table-input`)}</th><th>{section.sumPrice?.toFixed(2)}</th>
											{this.getCrossCell()}
										</tr>
									</tbody>
								)
							})
						}
					<tbody>
						<tr>
							<td colSpan='6'><button	type='button'	disabled={sections.length === MAX_SECTIONS_LENGTH} onClick={e => this.addSection()}>Добавить раздел</button></td>
							{this.getCrossCell()}
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<th colSpan='5'>Накладные и транспортные расходы:</th><th>{specData.relatedExpanses?.toFixed(2)}</th>
							{this.getCrossCell()}
						</tr>
						<tr>
							<th colSpan='5'>Итого по смете:</th><th>{specData.sumPriceTaxFree?.toFixed(2)}</th>
							{this.getCrossCell()}
						</tr>
						<tr>
							<th colSpan='5'>НДС:</th><th>{specData.tax?.toFixed(2)}</th>
							{this.getCrossCell()}
						</tr>
						<tr>
							<td colSpan='6' style={{textAlign:'end'}}>{specData.taxInWords || ''}</td>
							{this.getCrossCell()}
						</tr>
						<tr>
							<th colSpan='5'>Итого:</th><th>{specData.sumPrice?.toFixed(2)}</th>
							{this.getCrossCell()}
						</tr>
						<tr>
							<td colSpan='6' style={{textAlign:'end'}}>{specData.sumPriceInWords || ''}</td>
							{this.getCrossCell()}
						</tr>
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