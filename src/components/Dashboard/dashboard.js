import React, { useState } from 'react';
import clsx from 'clsx';
import { Link, Redirect, useHistory } from "react-router-dom";
import { Button, Grid, InputBase } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

import './dashboard.css';
import { Logo, Name, getItem } from '../globals';
import SchemeViewer from './schemeviewer';

const fs = getComputedStyle(document.documentElement).getPropertyValue('--side-menu-font-size');
const bg = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
const hc = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color');
const oc = getComputedStyle(document.documentElement).getPropertyValue('--opposite-color');
const sw = getComputedStyle(document.documentElement).getPropertyValue('--side-menu-width');

// reference: https://material-ui.com/components/app-bar/ 
const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',
        marginRight: theme.spacing(6),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(hc, 0.15),
        transitionDuration: "0.3s",
        border: "none",
        width: "100%",
        '&:hover': {
            backgroundColor: fade(hc, 0.25),
        },
        marginLeft: 0,
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: "17ch",
            '&:focus': {
                width: '22ch',
            },
        },
    },
    colorButton: {
        boxShadow: 'none',
        display: "block",
	    padding: "0.7em",
        margin: "0.3em",
        width: `calc(${sw} * 2/3 + 1.5vw)`,
        textAlign: "left",
        fontSize: fs,
        border: "none",
        backgroundColor: bg,
    },
    hc: {
        '&:hover': {
            backgroundColor: hc,
        }
    },
    oc: {
        '&:hover': {
            backgroundColor: oc,
        }
    },
}));


function Header(props) {
    function Brand() {
		// displays the App's Logo and Name 
        return (
            <Link to="/" style={{textDecoration: 'none', color: 'black'}}>
                <div className="App-brand">
                        <img src={Logo} className="App-logo" alt="logo" />
                        <p>{Name}</p>
                </div>
            </Link>
        );
    }
    return (
		// displays Brand() to right and searchBar (in Dashboard to use state) to left
        <header className="App-header">
            <Brand />
            {props.searchBar()}
        </header>
    );
}

function SideMenu(props) {
    // SideMenu of buttons to change dashboard scheme view / view profile / logout
    const classes = useStyles();

    return (
		<Grid className="SideMenu">
			<h className="SideMenu-h">SCHEMING</h>
			<Button className={clsx(classes.colorButton, classes.hc)} onClick={props.onClickMySchemes}>My Schemes</Button>
			<Button className={clsx(classes.colorButton, classes.hc)} onClick={props.onClickBrowseSchemes}>Browse Schemes</Button>
			<Button className={clsx(classes.colorButton, classes.hc)} onClick={props.onClickMyUnivSchemes}>My Univ's Schemes</Button>
			<h className="SideMenu-h">ACCOUNT</h>
			<Button className={clsx(classes.colorButton, classes.oc)} onClick={props.onClickProfile}>Profile</Button>
			<Button className={clsx(classes.colorButton, classes.oc)} onClick={props.onLogout}>Logout</Button>
		</Grid> 
    );
}


function Dashboard(props) {
    /*
     * Header and side menu to display links to various pages / functionality
     * Such as Scheme Creator, My Schemes, Home, Search Schemes, etc.
     * Along with SchemeViewer to view schemes received after querying database
     */

    if (!sessionStorage.getItem('user')) {
        return <Redirect to="/" />;
    }

    // sess[0] = username, sess[1] = university
    const sess = [decodeURIComponent(props.sess[0]), decodeURIComponent(props.sess[1])];
    const classes = useStyles();
    const history = useHistory();

    // initially incorrect values to overwrite
    const [header, updateHeader] = useState("Memes");
    const [searchQuery, updateSearchQuery] = useState("");
    const [schemes, setSchemes] = useState([]);

    // to properly / smoothly display MySchemes after the async getSchemes request
    const [animate, setAnimate] = useState(false);

    // to load the initial Schemes View into the dashboard after decoding URL
    const [schemesLoaded, loadSchemes] = useState(false);

    // to figure out which schemes view to load
    let initialView = history.location.hash;
    let parsedView = decodeURI(initialView).split("?");

    // to display profile on click the profile button
    const [profile, updateProfile] = useState({
		username: parsedView.slice(6),  // not sess[0] to handle viewing other users' profiles
		university: "",
		editing: false,		            // to handle changes to university
        animateProfile: false,		    // to handle smoothness of animation
	});

	function handleUpdateProfile(newprops) {
		updateProfile({
			...profile,
			...newprops,
		});
	}

    function updateSchemeViewer(header_, query_, prefix="grading_schemes") {
        return (e) => {
			// % messes up the URL, so we have to remove it from header and query in order to get schemes
            header_ = header_.replace("%", "")
            query_ = query_.replace("%", "");

            // avoid encoding "=" and "?" in URL
            let splitQuery = query_.split("=");
            if (splitQuery[0] === "")
                splitQuery = "";
            else if (splitQuery[1] === "")
                splitQuery = encodeURIComponent(splitQuery[0]) + "=" + encodeURIComponent(" ");
            else
                splitQuery = encodeURIComponent(splitQuery[0]) + "=" + encodeURIComponent(splitQuery[1]);
            let query = splitQuery

            // if requested scheme view hasn't changed, don't load anything - extra work
            if (header_ === header && query === searchQuery)
                return (e) => {};

            // this allows for initial automatic schemes load
            if (!query && header_ === "Browse Schemes")
                prefix = "all_schemes";
            else if (header_.includes("Schemes created by") || header_.includes("Scheme Search"))
                prefix = "searchquery";
            else if (header_ === "Profile") 
                getProfile(query_.split("=")[1])();

            // get the schemes
            getItem(query, prefix)
            .then( data => data.json() ) 
            .then(
                data => {
                    setSchemes(data);
                    setAnimate(true);
                }
            );
            // schemes retrieved, so set animate false again in preparation for change of schemeView
            setAnimate(false);

            // update URL
            if (header_ !== header || query_ !== searchQuery) {
                history.replace(history.location.pathname + "#" + encodeURIComponent(header_) + "?" + splitQuery);
                updateHeader(header_);
                updateSearchQuery(query_);
            }
        };
    }

    function search(query, header_="Scheme Search Results for") {
        // Sarch the database for each word in input query (see Server/index.js for details on parsing search)

        // this helps with initial view, where query is taken from URL
        if (query.slice(0, 7) === "string=")
            query = query.slice(7);
        
        
        return updateSchemeViewer(
            header_ + " \"" + query + "\"", 
            "string=" + query,
            "searchquery",
        );
    }

    function searchBar() {
        return (
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>
                
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        search(searchQuery)();
                    }}
                    onClick={ (e) => updateSearchQuery(e.target.value) }
                >
                    <InputBase
                        placeholder="Search schemes..."
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        type="search"
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={ (e) => updateSearchQuery(e.target.value) }
                    />
                </form>
            </div>
        );
    }

    function getProfile(owner) {
        // handles correct retrieval of profile to view in dashboard and timing of fadein animation
        let updated_username = "";
        let updated_university = "";

        return (e) => {
            if (owner === sess[0]) {
                handleUpdateProfile({
                    username: sess[0],
                    university: sess[1],
                    animateProfile: true,
                    editing: false,
                });
                return null;
            }
            // if username and university are already loaded
            else if (profile.username !== owner || profile.university !== sess[1]) {
                getItem("username=" + owner, "user_univ")
                .then( res => res.text() )
                .then( res => {
                    if (res === "Account does not exist!") {
                        updated_username = "Account does not exist";
                    }
                    
                    else {
                        let temp = res.split(",");
                        updated_username = temp[0];
                        updated_university = temp[1];
                    }
                    // sometimes doesn't update in time for some reason
                    if (profile.username !== updated_username || profile.university !== updated_university) {
                        handleUpdateProfile({
                            username: updated_username,
                            university: updated_university,
                            animateProfile: true,
                            editing: false
                        });
                    }
                });
            }

            handleUpdateProfile({
                animateProfile: false,
            });
        }
    }

    function profileView(owner) {
        return updateSchemeViewer("Profile", "owner=" + owner);
    }
    
    return (
        <div>
			<Header searchBar={searchBar}/>
            <div className="App-bottom">
				<SideMenu 
					onClickMySchemes={updateSchemeViewer("My Schemes", "owner=" + sess[0])}
					onClickBrowseSchemes={updateSchemeViewer("Browse Schemes", "", "all_schemes")}
					onClickMyUnivSchemes={updateSchemeViewer("My University's Schemes", "university=" + sess[1])}
					onClickProfile={profileView(sess[0])}
					onLogout={ () => props.setUserInfo(["", ""]) }
				/>
                <SchemeViewer 
					loadInitialView={updateSchemeViewer(parsedView[0].slice(1), parsedView[1])}
					schemesLoaded={schemesLoaded}
					loadSchemes={loadSchemes}
                    header={header} 
                    query={searchQuery}
                    schemes={schemes} 
                    animate={(header === "Profile") ? (animate && profile.animateProfile) : animate} 
                    profile={profile}
                    updateProfile={handleUpdateProfile}
                    getProfile={profileView}
                    setUserInfo={props.setUserInfo}
                    sess={sess}
                />
            </div>
        </div>
    );
}

export default Dashboard;
