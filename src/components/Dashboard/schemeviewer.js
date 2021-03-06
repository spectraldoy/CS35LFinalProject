import './dashboard.css';
import React, { useState } from 'react';
import { 
	Box, Card, Grid, CardHeader, Typography, Paper, Button, ButtonBase, 
	IconButton, InputAdornment, TextField,
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import AddBoxSharpIcon from '@material-ui/icons/AddBoxSharp';
import EditIcon from '@material-ui/icons/Edit';
import { Redirect, useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert'
import { getItem, isAlphaNumeric } from "../globals";

const hc = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color');
const oc = getComputedStyle(document.documentElement).getPropertyValue('--opposite-color');

const useStyles = makeStyles((theme) => ({
    colorButton: {
		marginRight: theme.spacing(1),
		width: `26.5ch`, 
        backgroundColor: fade(oc, 0.25),
        '&:hover': {
            backgroundColor: fade(oc, 0.55),
        }
    },
	saveButton: {
		width: 'inherit',
		marginLeft: theme.spacing(-2),
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
	profile: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
		paddingTop: "5vh",
		paddingLeft: "4.5vw",
	},
	profileForm: {
		display: 'flex',
		flexDirection: 'column',
		width: "25ch",
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	headerText: {
		paddingRight: "3vw",
		paddingTop: "5vh", 
		paddingBottom: "0", 
		paddingLeft: "4.5vw",
	},
	textField: {
		margin: theme.spacing(1),
		marginLeft: theme.spacing(-2),
		marginTop: theme.spacing(3),
		width: "25ch",
	},
}));


function formatCategory(name, weight) {
	// properly format a grading category to display in scheme preview
	if (weight != null) {
		while (weight.length < 3) {
			weight = " " + weight;
		}
	}
	return weight + "% " + name;
}

function displayScheme(scheme, changeUrl, getProfile) {
	// display scheme as a button that on clicking redirects to the calculator interface
	// furthermore, has a tag to the top right showing the scheme creator's username
	// that when clicked redirects to the scheme creator's profile page

	return (
		<ButtonBase onClick={(e) => changeUrl("/calculatorInterface?id=" + scheme._id)}>
			<Card className="Scheme" style={{backgroundColor: "white"}} variant="elevated" elevation={1}>
				<Paper
					className="Scheme-preview"
					square={true}
					style={{flexGrow: 0, flexShrink: 0}}
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
								onClick={ (e) => { 
									e.stopPropagation(); 
									//userSearch(scheme.owner, "Schemes created by")(); 
									getProfile(scheme.owner)();
								}}
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

function displayProfile(props) {
	// display profile if Dashboard currently is supposed to display a user's profile

	let newUniversity = "";

	function handleSubmitNewUniversity(e) {
		e.preventDefault();
		if (!isAlphaNumeric(newUniversity, true)) {
			props.alert.error("University can only contain letters and numbers or SPACE \" ' ,");
			return;
		}
		if (props.profile.username === "Account does not exist") {
			props.alert.error("Failed to save: Account does not exist")
			return;
		}

		getItem("username=" + props.profile.username + "&new_university=" + newUniversity, "update_user")
		.then( res => res.text() )
		.then( res => {
			if (res !== "Account does not exist!") {
				props.updateProfile({university: newUniversity});
				props.alert.success("Saved new university");
			}
			else {
				props.alert.error("Failed to save: Account does not exist")
			}
		}); 
		props.setUserInfo([props.profile.username, newUniversity]);
	}

	return (
		<Grid className={props.classes.profile}>
			<CardHeader
				title={(props.profile.username === "Account does not exist") ? props.profile.username 
						: props.profile.username + "'s Profile"}
				align="left"
				className={props.classes.headerText}
				style={{paddingLeft: 0, paddingTop: 0, paddingBottom: "1vh"}}
			/>
			<form className={props.classes.profileForm} onSubmit={handleSubmitNewUniversity}>
				<TextField 
					error={props.profile.username === "Account does not exist"}
					label={props.profile.username === "Account does not exist" ? "Error" : "Username"} 
					id="username"
					disabled={true}
					className={props.classes.textField}
					variant="outlined"
					defaultValue={props.profile.username}
				/>
				<TextField
					error={props.profile.username === "Account does not exist"}
					label={props.profile.username === "Account does not exist" ? "Error" : "University"} 
					id="university"
					disabled={!props.profile.editing}
					className={props.classes.textField}
					variant="outlined"
					defaultValue={props.profile.university}
					onChange={ (e) => { newUniversity = e.target.value } }
					InputProps={{
						endAdornment: (props.profile.username === props.sess[0]) ?
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle edit univ"
									disabled={props.profile.username !== props.sess[0]}
									onClick={ (e) => props.updateProfile( {"editing": !props.profile.editing} ) }
									onMouseDown={ (e) => e.preventDefault() }
									edge="end"
								>
									<EditIcon />
								</IconButton> 
							</InputAdornment>
							: null
					}}
				/>
				{ props.profile.editing ? 
					<Button 
						className={props.classes.saveButton}
						align="left"
						type="submit"
						aria-label="save edits"
					>
						Save
					</Button>
				: null}
			</form>
			<CardHeader
				title={(props.profile.username === "Account does not exist") ? ""
						: props.profile.username + "'s Schemes"}
				align="left"
				className={props.classes.headerText}
				style={{paddingLeft: 0}}
			/>
		</Grid> 
		
	);
}

function SchemeViewer(props) {
	// Loads schemes for viewing, browsing, moving onto the calculator interface
	// and also displays button for creating a scheme

	if (!props.schemes) {
		return null;
	}
	
	const classes = useStyles();
	const history = useHistory();
	const alert = useAlert();
	const [redirectTo, changeUrl] = useState("");

	// to be able to use the browser back button to return to the most recent SchemeView 
	// in the dashboard, where the just clicked scheme was found
	if (redirectTo) {
		let URL = history.location.pathname + "#" + props.header + "?";
		let splitQuery = props.query.split("=");
		if (splitQuery[0] === "") {
			splitQuery = "";
		}
		else if (splitQuery[1] === "") {
			splitQuery = encodeURIComponent(splitQuery[0]) + "=" + encodeURIComponent(" ");
		}
		else {
			splitQuery = encodeURIComponent(splitQuery[0]) + "=" + encodeURIComponent(splitQuery[1]);
		}
		history.push(URL + splitQuery);
		// redirect to calculatorInterface or schemeBuilder
		return <Redirect to={redirectTo} />;
	}

    // load the initial schemes view into the scheme viewer (doesn't happen automatically)
	// input props schemesLoaded and loadSchemes use state in Dashboard to handle history pushe
    if (!props.schemesLoaded) {
        props.loadInitialView();
        props.loadSchemes(true);
    }
	
	// render the fetched schemes
	let renderedSchemes = []
	for (const scheme of props.schemes) {
		renderedSchemes.push(displayScheme(
			scheme, changeUrl, props.getProfile
		));
	}

	// if we haven't yet fetched the schemes / profile from the database, i.e., 
	// we haven't yet got the stuff we need to display, return nothing
	if (!props.animate)
		return null;
	else
		return (
			<div className="DashWin">
				{ props.header !== "Profile" ?
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
						align="left"
						className={classes.headerText}
					/>
				:
					displayProfile({
						classes: classes,
						profile: props.profile,
						updateProfile: props.updateProfile,
						setUserInfo: props.setUserInfo,
						alert: alert,
						sess: props.sess,
					})
				}
				<Grid className="SchemesView">
					{renderedSchemes}
				</Grid>
			</div>
		);
}

export default SchemeViewer;
