import React from "react";
import logo from './logo.svg';
import starco from './starco.svg';
import './Form.scss';

export default class Header extends React.Component {
	render() {
		return (
			<header className="App-header">
				<img src={starco} className="starco-logo" alt="starco-logo" />
				<img src={logo} className="App-logo" alt="logo" />
			</header>
		)
	}
}