const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const actions = require('./scripts/actions');
const bodyParser = require('body-parser');
const app = express();

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
	return res.send('pong');
});

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

app.use('/generateReport', async function (req, res) {
	await actions.generateReport(req.body.fileName, req.body.data);
	res.send('Report generated!');
});

app.use('/saveReport', function (req, res) {
	console.log("saveReport", __dirname);
	res.sendFile(__dirname+'\\scripts\\reports\\MyReport.docx');
});

app.listen(port, () => {
	console.log(`Server is up on port ${port}!`);
});