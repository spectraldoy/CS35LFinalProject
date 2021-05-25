import './dashboard.css';
import React from 'react';
import { Card, Grid, CardHeader, Typography, Paper } from '@material-ui/core';

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
	// this needs an onclick thing to reroute to the scheme editing page
	return (
		<Card className="Scheme" style={{backgroundColor: "white", variant: "elevated"}}>
			<Paper
				className="Scheme-preview"
				square={true}
			>
				<CardHeader
					title={scheme.class}
					subheader={scheme.professor + ", " + scheme.university}
					style={{textAlign: 'left'}}
				/>
			</Paper>
			<Paper 
				className="Scheme-preview" 
				square={true}
				style={{backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--highlight-color'), 
						color: 'black', flexGrow: 1}}
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


function SchemeViewer(props) {
	if (props.schemes === undefined) {
		return null;
	}
	let renderedSchemes = []
	for (const scheme of props.schemes) {
		// need a key here?
		renderedSchemes.push(displayScheme(scheme));
	}
	//console.log(renderedSchemes);

	// NOTE: WinHeader must have a New Scheme button always
	if (!props.animate)
		return <div className="DashWinLoading"></div>
	else
		return (
			<div className="DashWin">
				<Typography variant="h6">
					<CardHeader 
						title={props.header} 
						style={{textAlign: "left", paddingRight: "3vw", paddingTop: "5vh", paddingBottom: "0", paddingLeft: "4.5vw"}} 
					/>
				</Typography>
				<Grid className="SchemesView">
					{renderedSchemes}
				</Grid>
			</div>
		);
}

export default SchemeViewer;
