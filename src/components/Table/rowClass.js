export default class Row {
	constructor(number, name, measure, quantity, unitPrice) {
		this.number = number;
		this.name = name;
		this.measure = measure;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.sumPrice = quantity * unitPrice;
	}
}
