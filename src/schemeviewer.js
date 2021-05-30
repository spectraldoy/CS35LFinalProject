import './dashboard.css';
import React, { useState } from 'react';
import { Box, Card, Grid, CardHeader, Typography, Paper, Button, ButtonBase } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import AddBoxSharpIcon from '@material-ui/icons/AddBoxSharp';
import { Redirect, useHistory } from 'react-router-dom';

const hc = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color');
const oc = getComputedStyle(document.documentElement).getPropertyValue('--opposite-color');

const useStyles = makeStyles((theme) => ({
    colorButton: {
		marginRight: theme.spacing(1),
		width: `26.5ch`, /* 16vw */
		// vertical padding + font size from searchIcon
        backgroundColor: fade(oc, 0.25),
        '&:hover': {
            backgroundColor: fade(oc, 0.55),
        }
    },
    cardHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
}));


function formatCategory(name, weight) {
	if (weight != null) {
		while (weight.length < 3) {
			weight = " " + weight;
		}
	}
	return weight + "% " + name;
}

function displayScheme(scheme, userSearch, changeUrl) {
	// const classes = useStyles();

	return (
		<ButtonBase onClick={(e) => changeUrl("/calculatorInterface?id=" + scheme._id)}>
			<Card className="Scheme" style={{backgroundColor: "white"}} variant="elevated" elevation={1}>
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
					variant="outlined"
					style={{backgroundColor: hc, color: 'black', flexGrow: 1}}
				>
					<Box backgroundColor='white' style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-end',
					}}>
						<Paper
							variant="elevated" 
							elevation={2}
							square={true}
							style={{
								position:'absolute', 
								backgroundColor: oc,
								marginTop: "-0.1em",
							}}
						>
							<ButtonBase 
								style={{padding: "0.25em", paddingLeft: "0.5em", paddingRight: "0.5em"}} 
								onClick={ (e) => { e.stopPropagation(); userSearch(scheme.owner, "Schemes created by")(); }}
							>
								<Typography variant="caption">{scheme.owner}</Typography>
							</ButtonBase>
						</Paper>
					</Box>
					
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
		</ButtonBase>
	);
}

function ProfileHeader(props) {
	return (
		<CardHeader
			variant="h1"
			title={props.header} 
			style={{paddingTop: "5vh"}} 
		/>
	);
}

function SchemeViewer(props) {
	if (!props.schemes) {
		return null;
	}
	
	const classes = useStyles();
	const history = useHistory();
	const [redirectTo, changeUrl] = useState("");
	
	if (redirectTo) {
		history.push(props.URL);
		return <Redirect to={redirectTo} />;
	}
	
	let renderedSchemes = []
	for (const scheme of props.schemes) {
		renderedSchemes.push(displayScheme(scheme, props.userSearch, changeUrl));
	}
	//console.log(renderedSchemes);

	if (!props.animate)
		return <div className="DashWinLoading"></div>
	else
		return (
			<div className="DashWin">
				{ (props.header !== "Profile") ?
				<CardHeader
					action={ 
						<Button 
							className={classes.colorButton}
							align="right"
							aria-label="create new scheme"
							onClick={ (e) => { changeUrl("/schemeInterface") } }
							startIcon={<AddBoxSharpIcon className={classes.addicon}/>}
						>
							Create Scheme
						</Button>
					}
					title={props.header} 
					style={{textAlign: "left", paddingRight: "3vw", paddingTop: "5vh", paddingBottom: "0", paddingLeft: "4.5vw"}} 
				/>
				: ProfileHeader({header: props.header})
				}
				<Grid className="SchemesView">
					{renderedSchemes}
				</Grid>
			</div>
		);
}

export default SchemeViewer;
