export default class Subsection {
	constructor(rows, title, priceRow) {
		this.rows = rows;
		this.sumPrice = this.subsectionPrice();
		this.title = title || '';
		this.priceRow = priceRow || 'Итого';
	}

	subsectionPrice() {
		return this.rows.reduce((acc, val) => {
			return acc + val.sumPrice;
		}, 0);
	}
}
