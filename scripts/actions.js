const createReport = require('docx-templates');
const fs = require('fs');

let outputDirPath = './scripts/reports';

async function generateReport(name, data) {
	await createReport({
		template: './scripts/templates/template.docx',
		output: `${outputDirPath}/${name}.docx`,
		data
	}).catch(err => console.log(err))
}

async function getFilesArr() {
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