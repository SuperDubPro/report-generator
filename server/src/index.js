"use strict";

const Hapi = require('@hapi/hapi');
const exitHook = require('exit-hook');
// const createReport = require('docx-templates');
const readXlsxFile = require('read-excel-file/node');
const Fs = require('fs');
const Path = require('path');
const functions = require('./functions');

const server = Hapi.server({
	port: 3001,
	host: 'localhost',
	routes: {
		files: {
			relativeTo: Path.join(__dirname, 'public')
		}
	}
});

const handleFileUpload = file => {
	return new Promise((resolve, reject) => {
		const filename = file.hapi.filename;
		const data = file._data;

		fs.writeFile(`./reports/${filename}`, data, err => {
			if (err) {
				reject(err)
			}
			resolve({
				message: 'Upload successfully!',
				imageUrl: `${server.info.uri}/reports/${filename}`
			})
		})
	})
};

const init = async () => {
	await server.register(require('inert'));

	// console.log(server);
	// console.log(server.settings.routes);
	// server.route(
	// 	{
	// 		method: 'POST',
	// 		path:'/',
	// 		config: {
	// 			cors: {
	// 				origin: ["*"],
	// 			},
	// 		},
	// 		handler: async function(request, h) {
	// 			try {
	// 				// File path.
	// 				// readXlsxFile('smeta.xlsx').then((rows) => {
	// 				// 	console.log(rows);
	// 				// })
	// 				// console.log(request.payload);
	// 				await functions.makeReport(request.payload.name ,request.payload.data)
	// 			}
	// 			catch (err) {
	// 				console.log(err);
	// 			}
	// 			// console.log(request);
	// 			// console.log("!",h);
	//
	// 			// return 'success!';
	//
	// 			const arr = await functions.getFilesArr();
	// 			return arr;
	// 		}
	// 	}
	// );
	// server.route(
	// 	{
	// 		method: 'GET',
	// 		path:'/myReport.docx',
	// 		config: {
	// 			cors: {
	// 				origin: ["*"],
	// 			},
	// 		},
	// 		handler: await function(request, h) {
	// 			console.log(h.file('/reports/myReport.docx'));
	//
	// 			return h.file('/reports/myReport.docx')
	// 			// return "!!"
	// 		}
	// 	}
	// );
	server.route({
		path: '/',
		method: 'GET',
		handler: (req, h) => ({ message: 'Hello Hapi.js' })
	})

	server.route({
		method: 'GET',
		path: '/reports/{file*}',
		handler: {
			directory: {
				path: 'reports'
			}
		}
	});

	server.route({
		path: '/reports',
		method: 'POST',
		options: {
			payload: {
				output: 'stream'
			}
		},
		handler: async (req, h) => {
			const { payload } = req

			const response = handleFileUpload(payload.file);
			return response
		}
	})

	await server.start();
	console.log('Server running on %ss', server.info.uri);
};

process.on('unhandledRejection', (err) => {
	if(err.code === "EADDRINUSE") exitHook(() => {
		process.exit();
		console.log('Exiting');
	});
});

init();