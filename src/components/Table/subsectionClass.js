export default class Subsection {
	constructor(rows, title, priceRow) {
		this.rows = rows;
		this.sumPrice = this.subsectionPrice();
		this.title = title || '';
		this.priceRow = priceRow || (title ? `Итого за ${title.toLowerCase()}` : '');
	}

	subsectionPrice() {
		return this.rows.reduce((acc, val) => {
			return acc + val.sumPrice;
		}, 0);
	}

	get structure() {
		return {
			rows: this.rows,
			sumPrice: this.sumPrice,
			title: this.title,
			priceRow: this.priceRow
		}
	}
}
