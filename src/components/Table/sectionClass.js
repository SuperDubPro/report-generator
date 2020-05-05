export default class Section {
	constructor(subsections, title, priceRow) {
		this.subsections = subsections;
		this.sumPrice = this.sectionPrice();
		this.title = title || '';
		this.priceRow = priceRow || 'Итого по разделу';
	}

	sectionPrice() {
		return this.subsections.reduce((acc, val) => {
			return acc + val.sumPrice;
		}, 0);
	}
}
