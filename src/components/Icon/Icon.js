import React from "react";

export default class Icon extends React.Component {
	constructor(props) {
		super(props);
		this.Icons = {
			cross: (
				<svg xml="preserve" viewBox="0 0 100 100" y="0" x="0" xmlns="http://www.w3.org/2000/svg"
						 version="1.1" width="16px" height="16px"
				>
					<g>
						<path fill="#e15b64" d="M65.569 19.949L50 35.518 34.431 19.949c-3.993-3.993-10.49-3.993-14.483 0s-3.993 10.49 0 14.483l15.569 15.569L19.948 65.57c-3.993 3.993-3.993 10.49 0 14.483 3.993 3.993 10.49 3.993 14.483 0L50 64.484l15.569 15.569c3.993 3.993 10.49 3.993 14.483 0s3.993-10.49 0-14.483L64.483 50.001l15.569-15.569c3.993-3.993 3.993-10.49 0-14.483-3.993-3.993-10.49-3.993-14.483 0z"> </path>
					</g>
					</svg>
			)
		}
	}

	render() {
		return (
			<div style={{pointerEvents: "none"}}>
				{this.Icons[this.props.name]}
			</div>
		)
	}
}


