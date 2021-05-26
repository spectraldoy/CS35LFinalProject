import './dashboard.css';
import React from 'react';
import { Box, Card, Grid, CardHeader, Typography, Paper, Button } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import AddBoxSharpIcon from '@material-ui/icons/AddBoxSharp';

const hc = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color');
const oc = getComputedStyle(document.documentElement).getPropertyValue('--opposite-color');

const useStyles = makeStyles((theme) => ({
    colorButton: {
		marginRight: theme.spacing(0.75),
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

function displayScheme(scheme, userSearch) {
	// const classes = useStyles();
	// this needs an onclick thing to reroute to the scheme editing page
	return (
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
				<Box mt={-0.05} backgroundColor='white' style={{
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
						}}
					>
						<Button style={{textTransform: 'none', padding: "0.25em"}} onClick={userSearch(scheme.owner)}>
							<Typography variant="caption">{scheme.owner}</Typography>
						</Button>
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
	);
}


function SchemeViewer(props) {
	if (props.schemes === undefined) {
		return null;
	}
	
	const classes = useStyles();
	let renderedSchemes = []
	for (const scheme of props.schemes) {
		// need a key here?
		renderedSchemes.push(displayScheme(scheme, props.userSearch));
	}
	//console.log(renderedSchemes);

	// NOTE: WinHeader must have a New Scheme button always
	if (!props.animate)
		return <div className="DashWinLoading"></div>
	else
		return (
			<div className="DashWin">
				<CardHeader
					action={ 
						<Button 
							className={classes.colorButton}
							align="right"
							aria-label="create new shceme"
							onClick={ (e) => { /* props.createNewScheme() */ } }
							startIcon={<AddBoxSharpIcon className={classes.addicon}/>}
						>
							Create Scheme
						</Button>
					}
					title={props.header} 
					style={{textAlign: "left", paddingRight: "3vw", paddingTop: "5vh", paddingBottom: "0", paddingLeft: "4.5vw"}} 
				/>
				<Grid className="SchemesView">
					{renderedSchemes}
				</Grid>
			</div>
		);
}

export default SchemeViewer;
