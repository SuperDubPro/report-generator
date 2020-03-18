const createReport = require('docx-templates');
const fs = require('fs');

let outputDirPath = './server/src/reports';

async function makeReport(name, data) {
	await createReport({
		template: './server/src/templates/template.docx',
		output: `${outputDirPath}/${name}`,
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
	makeReport,
	getFilesArr
};