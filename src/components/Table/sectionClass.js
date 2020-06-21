export default class Section {
	constructor(subsections, title, priceRow, relatedExpansesPerc) {
		this.subsections = subsections;
		this.subsectionsSumPrice = this.sectionPrice();
		this.title = title || '';
		this.priceRow = priceRow || 'Итого по разделу';
		// this.relatedExpanses = 0;
		this.relatedExpansesPerc = relatedExpansesPerc || 8;
		this.relatedExpanses = this.subsectionsSumPrice * this.relatedExpansesPerc / 100;
		this.sumPrice = this.subsectionsSumPrice + this.relatedExpanses;
	}

	sectionPrice() {
		return this.subsections.reduce((acc, val) => {
			return acc + val.sumPrice;
		}, 0);
	}
}
