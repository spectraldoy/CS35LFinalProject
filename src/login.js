// modified from https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

import React, { useState } from 'react';
import clsx from 'clsx';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Box, FormControl, InputAdornment, InputLabel, Input, IconButton, Button } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import { useAlert } from 'react-alert'

import './login.css';
import { Logo, Name } from './globals';

const hc = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color');

// Material-UI code mostly taken from: https://material-ui.com/components/text-fields/
const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(0.75),
    },
    textField: {
        width: '25ch',
        color: 'black',
        paddingTop: theme.spacing(1),
    },
    colorButton: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(2),
        width: "40%",
        backgroundColor: fade(hc, 0.15),
        '&:hover': {
            backgroundColor: fade(hc, 0.55),
        }
    },
    visibility: {
        paddingBottom: theme.spacing(1),
        marginRight: theme.spacing(-1),
    }
  }));

function Login(props) {

    if (sessionStorage.getItem('user'))  // already logged in
        return <Redirect to="/homePage" />;

    const alert = useAlert();
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, changeVisibilityOfPassword] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await loginUser(username, password);
        switch (res[0]) {
            case "0":
                // stores university is session storage as well
                props.setUser(username + "," + res.slice(1));
                break;
            case "1":
                alert.error('Incorrect password');
                break;
            case "2":
                alert.error('Username not found');
                break;
            default:
                alert.error('Unknown Error');
                break;
        }
    }

    return (
        <div className="login-wrapper">
			<div className="login-brand">
				<img src={Logo} className="App-logo" alt="logo" />
				<p>{Name}</p>
			</div>
            <form className="login-credentials" onSubmit={handleSubmit}>
                <FormControl className={clsx(classes.margin, classes.textField)}>
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={ (e) => setUsername(e.target.value) }
                    />
                </FormControl>
                <FormControl className={clsx(classes.margin, classes.textField)}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={ (e) => setPassword(e.target.value) }
                        endAdornment={
                            <InputAdornment position="end" className={classes.visibility}>
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={ (e) => changeVisibilityOfPassword( !showPassword ) }
                                    onMouseDown={ (e) => e.preventDefault() }
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <Box display="flex" mt={2} width="100%" justifyContent="flex-end">
                    <Button type='submit' className={classes.colorButton}>Next</Button>
                </Box>
            </form>
        </div>
    );
}

async function loginUser(username, password) {
    // check username and password with database
    // 0 = success, 1 = wrong password, 2 = username not found
    let res = await fetch("http://localhost:3001/users?username=" + username + "&password=" + password);
    res = res.text();
    return res;
}

export default Login;

