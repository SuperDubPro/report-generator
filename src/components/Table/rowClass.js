export default class Row {
	constructor(number, name, measure, quantity, unitPrice) {
		this.number = number;
		this.name = name;
		this.measure = measure;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.sumPrice = quantity * unitPrice;
	}

	get structure() {
		return {
			number: this.number,
			name: this.name,
			measure: this.measure,
			quantity: this.quantity,
			unitPrice: this.unitPrice,
			sumPrice: this.sumPrice
		}
	}
}
