// modified from https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
import React, { useState } from 'react';
import clsx from 'clsx';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Box, FormControl, InputAdornment, InputLabel, Input, IconButton, Button, Typography } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import { useAlert } from 'react-alert'

import './login.css';
import { Logo, Name } from '../../globals';

const hc = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color');

const useStyles = makeStyles((theme) => ({
    credentials: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    margin: {
        margin: theme.spacing(1),
    },
    textField: {
        width: '25h',
        color: 'black',
    },
    colorButton: {
        fullWidth: true,
        backgroundColor: fade(hc, 0.15),
        '&:hover': {
            backgroundColor: fade(hc, 0.55),
        }
    },
    box: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
  }));

function Login(props) {

    if (sessionStorage.getItem('user'))  // already logged in
        return <Redirect to="/" />;

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
                props.setUserInfo([username, res.slice(1)]);
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
            <form className={classes.credentials} onSubmit={handleSubmit}>
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
                            <InputAdornment position="end">
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
                <Box className={clsx(classes.box, classes.margin)}>
                    <Button type='submit' className={classes.colorButton}>Sign In</Button>
                    <Typography variant='overline' align='center'>Or</Typography>
                    <Button className={classes.colorButton} href="/createAccount">Create New Account</Button>
                </Box>
            </form>
        </div>
    );
}

async function loginUser(username, password) {
    // check username and password with database
    // 0 = success, 1 = wrong password, 2 = username not found
    const url = "http://localhost:3001/users?username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
    let res = await fetch(url);
    res = res.text();
    return res;
}

export default Login;

