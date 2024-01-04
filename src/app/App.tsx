import React from 'react';
import {TodolistLists} from "../features/TodolistsList/TodolistLists";
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar/AppBar';
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import './App.css';
import LinearProgress from '@mui/material/LinearProgress';
import {useAppSelector} from "./store";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Login} from "../features/Login/login";
import {Navigate, Route, Routes} from "react-router-dom";


export function App() {
    const status = useAppSelector(state => state.app.status)
    return (
        <div className={"app"}>
            <AppBar position="static" sx={{position: "relative", marginBottom: "1rem"}}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === "loading" &&
                    <LinearProgress color="secondary" sx={{position: "absolute", top: "100%", left: 0, right: 0}}/>}
            </AppBar>
            <Container maxWidth={"lg"}>
                <Routes>
                    <Route path={'/'} element={<TodolistLists/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/404'} element={<h1>⛔Page not found⛔</h1>}/>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
            <ErrorSnackbar/>
        </div>
    )
}

export default App;
