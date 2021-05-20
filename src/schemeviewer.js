import './dashboard.css';
import React from 'react';

import { Card, Grid, CardHeader, Typography, Paper } from '@material-ui/core';

import { getScheme } from './schemes';

// Dashboard Windows: MySchemes, BrowseSchemes, SearchSchemes, MyUnivSchemes, Profile, Settings

function formatCategory(name, weight) {
	if (weight != null) {
		while (weight.length < 3) {
			weight = " " + weight;
		}
	}
	return weight + "% " + name;
}

function displayScheme(scheme) {
	
	/*
	<CardHeader
		title={scheme.schemeID}
		subheader={scheme.creatorID}
	/>
	getComputedStyle(document.documentElement).getPropertyValue('--highlight-color'), color: 'white'}
	*/

	// this needs an onclick thing to reroute to the scheme editing page
	return (
		<Card className="Scheme" style={{backgroundColor: "white"}} variant="elevated">
			<CardHeader
				title={scheme.class}
				subheader={scheme.professor + ", " + scheme.university}
				style={{textAlign: 'left'}}
			/>
			<Paper 
				className="Scheme-preview" 
				variant="outlined"
				square
				style={{backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--highlight-color'), color: 'black'}}
			>
				<Typography variant="caption" style={{color: 'white'}}>
					<ul>
						{scheme.categories.map(
							(category) => <li key={category._id}>{
								formatCategory(category.name, category.weight)
							}</li>
						)}
					</ul>
				</Typography>
			</Paper>
		</Card>
	);
}

// TODO: make this a class schemeviewer, with passed in props
// props - what window, search schemes, my schemes, uni schemes, etc.
// header / viewer title

class SchemeViewer extends React.Component {
	// TODO: make a generic loadScheme function, which loads by userID or schemeID from the database
	//       so that we don't duplicate code for other parts of the web app
	constructor(props) {
		// props.userID?
		super(props);
		this.state = {
			mySchemes: [],
			animate: false,
		};
	}

	async getMySchemes() {
		// make this a props getSchemes
		const response = await getScheme("username=" + sessionStorage.token);
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
					animate: true,
				});
			}
		);
	}

	componentWillUnmount() {
		if (this._asyncRequest) {
			this._asyncRequest = null;
		}
		this.setState({
			animate: false,
		});
	}
	
	render() {
		let renderedSchemes = []
		for (const scheme of this.state.mySchemes) {
			renderedSchemes.push(displayScheme(scheme));
		}
		console.log(this.state.mySchemes)
		// NOTE: WinHeader must have a New Scheme button always
		return (
			<div className={this.state.animate ? "DashWin" : "DashWinLoading"}>
				<Typography variant="h6">
					<CardHeader 
						title={this.state.animate ? "My Schemes" : ""} 
						style={{textAlign: "left", paddingRight: "3vw", paddingTop: "5vh", paddingBottom: "0", paddingLeft: "4.5vw"}} 
					/>
				</Typography>
				<Grid className="MySchemes">
					{renderedSchemes}
				</Grid>
			</div>
		);
	}
}

export default SchemeViewer;
