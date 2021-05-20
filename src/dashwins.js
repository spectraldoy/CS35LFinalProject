import './dashboard.css';
import React from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { getScheme } from './schemes';

// Dashboard Windows: MySchemes, BrowseSchemes, SearchSchemes, MyUnivSchemes, Profile, Settings

function displayScheme(scheme) {

	return (
		<Card className="Scheme">
			<CardContent>
				<Typography variant="h5">
					{scheme.class}<br />
					{scheme.professor}<br />
					{scheme.university}<br />
					{scheme.schemeID}<br />
					{scheme.creatorID}<br />
				</Typography>
			</CardContent>
		</Card>
	);

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

class MySchemes extends React.Component {
	// TODO: make a generic loadScheme function, which loads by userID or schemeID from the database
	//       so that we don't duplicate code for other parts of the web app
	constructor(props) {
		// props.userID?
		super(props);
		this.state = {
			mySchemes: [],
		};
	}

	async getMySchemes() {
		// TODO: getscheme by userID=user.USERID or something like that
		const response = await getScheme("userID=12345678&university=UCLA");
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
	
	render() {
		let renderedSchemes = []
		for (const scheme of this.state.mySchemes) {
			renderedSchemes.push(displayScheme(scheme));
		}
		console.log(this.state.mySchemes)
		// NOTE: WinHeader must have a New Scheme button always
		return (
			<div className="DashWin">
				<div className="WinHeader">
					<h>My Schemes</h>
				</div>
				<Grid className="MySchemes">
					{renderedSchemes}
				</Grid>
			</div>
		);
	}
}

export default MySchemes;
