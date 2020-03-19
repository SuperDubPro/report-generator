import React from 'react';
import axios from 'axios';

export default class Form extends React.Component {

	componentDidMount() {
		axios
			.get('http://localhost:3000/qwerty')
			.then(res => {
				let blob = new Blob([res]);
				console.log(blob);
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.style.display = 'none';
				a.href = url;
				a.download = 'report.docx';
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			})
			// .catch(error => new error(error));
	}

	render() {
		return (
			<div>
				Hi!
			</div>
		)
	}
}