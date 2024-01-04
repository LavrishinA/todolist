import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";

type FormData = {
    email: string
    password: string
    rememberMe: boolean
}
export const Login = () => {
    const formik = useFormik<FormData>({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: (values) => {
            console.log(JSON.stringify(values))
        }
    })
    console.log(formik.values)

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            name={'email'}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                        />
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            name={'password'}
                            onChange={formik.handleChange}
                            value={formik.values.password}
                        />
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox/>}
                            name={'rememberMe'}
                            onChange={formik.handleChange}
                            checked={formik.values.rememberMe}
                        />
                        <Button
                            type={'submit'}
                            variant={'contained'}
                            color={'primary'}
                        >
                            Login
                        </Button>
                    </FormGroup>
                </form>
            </FormControl>

        </Grid>

    </Grid>
}