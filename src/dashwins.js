import './dashboard.css';
import React from 'react';
import { getScheme } from './schemes';
// Dashboard Windows: MySchemes, BrowseSchemes, SearchSchemes, MyUnivSchemes, Profile, Settings

class MySchemes extends React.Component {
	// TODO: make a generic loadScheme function, which loads by userID or schemeID from the database
	//       so that we don't duplicate code for other parts of the web app
	constructor(props) {
		// props.userID?
		super(props);
		this.state = {
			mySchemes: null,
		};
	}

	async getMySchemes() {
		// TODO: getscheme by userID=user.USERID or something like that
		const response = await getScheme("professor=Eggert");
		return response;
	}

	componentDidMount() {
		this._asyncRequest = this.getMySchemes()
		.then( data => data.json() ) 
		.then(
			data => {
				this._asyncRequest = null;
				this.setState({
					mySchemes: data,
				});
			}
		);
	}

	componentWillUnmount() {
		if (this._asyncRequest) {
			this._asyncRequest = null;
		}
	}

	displayScheme(scheme) {
		return (
			<div className="Scheme">
				{/* <h>{scheme._id}</h> */}
				<div className="Scheme-preview">
					{scheme.categories.map(
						(category) => <li key={category._id}>{
							category.name + " " + category.weight
						}</li>
					)}
				</div>
				<ul>
					<li>{scheme.course}</li>
					<li>{scheme.prof}</li>
					<li>{scheme.uni}</li>
				</ul>
			</div>
		);
	}
	
	render() {
		if (this.state.mySchemes == null) {
			return null;	
		}
		let renderedSchemes = []
		for (const scheme of this.state.mySchemes) {
			renderedSchemes.push(this.displayScheme(scheme));
		}
		console.log(this.state.mySchemes)
		// NOTE: WinHeader must have a New Scheme button always
		return (
			<div className="DashWin">
				<div className="WinHeader">
					<h>My Schemes</h>
				</div>
				<div className="MySchemes">
					{renderedSchemes}
				</div>
			</div>
		);
	}
}

export default MySchemes;
