import React, { useEffect } from "react"
import Container from "@mui/material/Container"
import Toolbar from "@mui/material/Toolbar"
import AppBar from "@mui/material/AppBar/AppBar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import MenuIcon from "@mui/icons-material/Menu"
import LinearProgress from "@mui/material/LinearProgress"
import { Login } from "features/Login/ui/Login"
import { Navigate, Route, Routes } from "react-router-dom"
import CircularProgress from "@mui/material/CircularProgress"
import { ErrorSnackbar } from "shared/ui"
import { appSelectors } from "app/app-slice"
import { authActions, authSelectors } from "features/Login"
import "./App.css"
import { TodolistLists } from "features/TodolistsList/ui"
import { useAppDispatch, useAppSelector } from "shared/lib"

export function App() {
    const status = useAppSelector(appSelectors.status)
    const isInitialized = useAppSelector(appSelectors.isInitialized)
    const isLoggedIn = useAppSelector(authSelectors.isLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(authActions.me())
    }, [dispatch])

    const logoutHandler = () => {
        dispatch(authActions.logout())
    }

    if (!isInitialized) {
        return (
            <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div className={"app"}>
            <AppBar position="static" sx={{ position: "relative", marginBottom: "1rem" }}>
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        News
                    </Typography>
                    {isLoggedIn && (
                        <Button onClick={logoutHandler} color="inherit">
                            Logout
                        </Button>
                    )}
                </Toolbar>
                {status === "loading" && <LinearProgress color="secondary" sx={{ position: "absolute", top: "100%", left: 0, right: 0 }} />}
            </AppBar>
            <Container maxWidth={"lg"}>
                <Routes>
                    <Route path={"/"} element={<TodolistLists />} />
                    <Route path={"/login"} element={<Login />} />
                    <Route path={"/404"} element={<h1>⛔Page not found⛔</h1>} />
                    <Route path={"*"} element={<Navigate to={"/404"} />} />
                </Routes>
            </Container>
            <ErrorSnackbar />
        </div>
    )
}

export default App
