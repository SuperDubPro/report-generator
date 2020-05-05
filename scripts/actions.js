const createReport = require('docx-templates');
const fs = require('fs');
const xlsxTemplate = require('xlsx-template');


let outputDir = './scripts/reports';

function generateReport(data) {
	// if(data.sections) {
	// 	setSectionsMapping(data.sections, data);
	// }
	// console.log(data.sections[0].subsections[0].rows[0]);
	formatNums(data);
	return new Promise((res, rej) => {
		res(createReport({
			template: './scripts/templates/template.docx',
			output: `${outputDir}/MyReport.docx`,
			data,
			cmdDelimiter: ['{', '}'],
		}).catch(err => rej(err)))
	})
}

function generateXlsx(data, type) {
	// Load an XLSX file into memory
	// console.log("!!!",__dirname);
	return new Promise( (res, rej) => {
		const specLength = data.sections.length;
		fs.readFile(`${__dirname}/templates/${type}/template${specLength}.xlsx`, function(err, file) {
			if(err) rej(err);
			// Create a template
			const template = new xlsxTemplate(file);

			// Replacements take place on first sheet
			let sheetNumber = 1;
			setSectionsMapping(data.sections, data);
			// Set up some placeholder values matching the placeholders in the template
			// const values = {
			// 	extractDate: new Date(),
			// 	dates: [ new Date("2013-06-01"), new Date("2013-06-02"), new Date("2013-06-03") ],
			// 	people: [
			// 		{name: "John Smith", age: 20},
			// 		{name: "Bob Johnson", age: 22}
			// 	]
			// };



			// Perform substitution
			template.substitute(sheetNumber, data);

			// Get binary data
			// const data = template.generate({type: 'uint8array'});
			let xlsxBuffer = template.generate();
			fs.writeFile(__dirname + `/reports/My_${type}.xlsx`, xlsxBuffer, 'binary', (err)=>{
				if (err) throw err;
				res("Spec success!")
			});
			// res(xlsxData);
		});
	});
}

function setSectionsMapping(sections, outputObj) {
	sections.forEach((section, sectionNum) => {
		outputObj[`section${sectionNum}_title`] = section.title;
		outputObj[`section${sectionNum}_sumPrice`] = section.sumPrice;
		outputObj[`section${sectionNum}_priceRow`] = section.priceRow;
		outputObj[`section${sectionNum}_relatedExpanses`] = section.relatedExpanses;
		section.subsections.forEach((subsection, subsectionNum) => {
			outputObj[`section${sectionNum}_subsection${subsectionNum}_title`] = subsection.title;
			outputObj[`section${sectionNum}_subsection${subsectionNum}_sumPrice`] = subsection.sumPrice;
			outputObj[`section${sectionNum}_subsection${subsectionNum}_priceRow`] = subsection.priceRow;
			outputObj[`section${sectionNum}_subsection${subsectionNum}_rows`] = subsection.rows;
		});
	});
}

function formatNums(obj) {
	obj.sumPrice = obj.sumPrice.toFixed(2);
	obj.relatedExpanses = obj.relatedExpanses.toFixed(2);
	obj.sections.forEach(section => {
		section.sumPrice = section.sumPrice.toFixed(2);
		section.subsections.forEach(subsection => {
			subsection.sumPrice = subsection.sumPrice.toFixed(2);
			subsection.rows.forEach(row => {
				row.sumPrice = row.sumPrice.toFixed(2);
				row.unitPrice = row.unitPrice.toFixed(2);
			})
		})
	})
}

module.exports = {
	generateReport,
	generateXlsx
};