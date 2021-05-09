import './dashboard.css';
import React from 'react';

// Dashboard Windows: MySchemes, BrowseSchemes, SearchSchemes, MyUnivSchemes, Profile, Settings

class MySchemes extends React.Component {
	// TODO: make this a generic loadScheme function, which loads by userID or schemeID from the database
	//       so that we don't duplicate code for other parts of the web app
	getMySchemes() {
			// TODO: Search through database using this.props.userID 
    return ([
			{
				schemeName: "Za Scheme",
				university: "UCLA",
				professor: "Eggert",
				class: "CS35L",
				userID: "1234",
				schemeID: "5678",
				categories: [
						{name: "HW", weight: 0.05},
						{name: "Midterm", weight: 0.2},
						{name: "Assignments", weight: 0.05},
						{name: "Final Exam", weight: 0.4},
						{name: "Final Project", weight: 0.3},
				],
			},
			{
				schemeName: "Potatscheme Schemeovitch",
				university: "UCLA",
				professor: "Reinman",
				class: "CS33",
				userID: "1234",
				schemeID: "2352",
				categories: [
					{name: "HW", weight: 0.1},
					{name: "Labs", weight: 0.3},
					{name: "Midterm", weight: 0.2},
					{name: "Final", weight: 0.4},
				],
			},
			{
				schemeName: "Potatscheme Schemeovitch",
				university: "UCLA",
				professor: "Reinman",
				class: "CS33",
				userID: "1234",
				schemeID: "2352",
				categories: [
					{name: "HW", weight: 0.1},
					{name: "Labs", weight: 0.3},
					{name: "Midterm", weight: 0.2},
					{name: "Final", weight: 0.4},
				],
			},
			{
				schemeName: "Potatscheme Schemeovitch",
				university: "UCLA",
				professor: "Reinman",
				class: "CS33",
				userID: "1234",
				schemeID: "2352",
				categories: [
					{name: "HW", weight: 0.1},
					{name: "Labs", weight: 0.3},
					{name: "Midterm", weight: 0.2},
					{name: "Final", weight: 0.4},
				],
			},
		]);
	}

	displayScheme(scheme) {
		return (
			<div className="Scheme">
				<h>{scheme.schemeName}</h>
				<div className="Scheme-bottom">
					<ul>
						<li>{scheme.class}</li>
						<li>{scheme.professor}</li>
						<li>{scheme.university}</li>
					</ul>
					<p>TODO: Preview</p>
				</div>
			</div>
		);
	}

	render() {
		const mySchemes = this.getMySchemes();
		let renderedSchemes = [];
		for (const scheme of mySchemes) {
			renderedSchemes.push(this.displayScheme(scheme))
		}
		return (
			<div className="Window">
				<h className="WinHeader">My Schemes</h>
				<div className="MySchemes">
					{renderedSchemes}
				</div>
			</div>
		);
	}
}

export default MySchemes;
