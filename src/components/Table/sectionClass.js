export default class Section {
	constructor(subsections, title, priceRow) {
		this.subsections = subsections;
		this.sumPrice = this.sectionPrice();
		this.title = title || '';
		this.priceRow = priceRow || (title ? `Итого за ${title.toLowerCase()}` : '');
	}

	sectionPrice() {
		return this.subsections.reduce((acc, val) => {
			return acc + val.sumPrice;
		}, 0);
	}

	get structure() {
		return {
			subsections: this.subsections,
			sumPrice: this.sumPrice,
			title: this.title,
			priceRow: this.priceRow
		}
	}
}
