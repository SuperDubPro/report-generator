"use strict";

const Hapi = require('@hapi/hapi');
const exitHook = require('exit-hook');
// const createReport = require('docx-templates');
const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const functions = require('./functions');

const init = async () => {
	const server = Hapi.server({
		port: 3001,
		host: 'localhost'
	});

	// console.log(server);
	// console.log(server.settings.routes);
	server.route(
		{
			method: 'POST',
			path:'/',
			config: {
				cors: {
					origin: ["*"],
				},
			},
			handler: async function(request, h) {
				try {
					// File path.
					// readXlsxFile('smeta.xlsx').then((rows) => {
					// 	console.log(rows);
					// })
					// console.log(request.payload);
					await functions.makeReport(request.payload)
				}
				catch (err) {
					console.log(err);
				}
				// console.log(request);
				// console.log("!",h);

				return 'success!';
			}
		});
		server.route(
		{
			method: 'GET',
			path:'/',
			config: {
				cors: {
					origin: ["*"],
				},
			},
			handler: async function(request, h) {
				const arr = await functions.getFilesArr();
				// try {
				// }
				// catch (err) {
				// 	console.log(err);
				// }
				return arr;
			}
		}
	);

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