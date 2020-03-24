const createReport = require('docx-templates');
const fs = require('fs');

let outputDirPath = './scripts/reports';

function generateReport(data) {
	return new Promise((res, rej) => {
		res(createReport({
			template: './scripts/templates/template.docx',
			// output: 'buffer', MyReport
			// output: `${outputDirPath}/${name}.docx`,
			output: `${outputDirPath}/MyReport.docx`,
			data
		}).catch(err => rej(err)))
	})

	// const buffer = await createReport({
	// 	template: './scripts/templates/template.docx',
	// 	output: `${outputDirPath}/${name}.docx`,
	// 	data
	// }).catch(err => console.log(err)).then(val => console.log(val));
	// console.log(buffer);
	// return buffer
}

function getFilesArr() {
	return new Promise((res,rej) => {
		fs.readdir(outputDirPath, (err, files) => {
			if (err) rej(err);
			else res(files);
		});
	})
}

module.exports = {
	generateReport,
	getFilesArr
};