import { Button, Link, List, ListItem, TextField, Typography} from '@mui/material';
import React, { useContext, useEffect } from 'react'
import {useForm, Controller} from 'react-hook-form';
import Form from '../components/Form';
import Layout from "../components/Layout"
import {useSnackbar} from 'notistack'
import NextLink from 'next/link'
import {useRouter} from 'next/router'
import { Store } from '../context/Store';
import Cookies from 'js-cookie';
import axios from 'axios';
import { getError } from '../utils/error';
import { useSession, signIn, signOut } from "next-auth/react"
import GoogleIcon from '@mui/icons-material/Google';
import { client } from '../lib/client';
import bcrypt from 'bcryptjs';



const Register = () => {
    const {handleSubmit, control, formState:{errors}, } = useForm();
   
    const {state, dispatch} = useContext(Store)
    const {userInfo} = state
    const router = useRouter()
    const {redirect} = router.query;


    useEffect(() => {
        if(userInfo && session) {
            router.push(redirect || '/')
        }
    }, [router, userInfo, redirect])
    
    
    const {enqueueSnackbar} = useSnackbar();

    const { data:session } = useSession();
    
    console.log(session)

    const submitHandler = async ({email, password, name, confirmPassword}) =>{
            if (password !== confirmPassword) {
                enqueueSnackbar("Passwords don't match", {variant:"error"})
                return;
            }
            try {
                const {data} = await axios.post('/api/users/register', {
                    name, email, password
                });
                
                dispatch({type:'USER_LOGIN', payload:data})
                Cookies.set('userInfo', JSON.stringify(data))
                router.push(redirect || '/')
                
            } catch (err) {
                enqueueSnackbar(getError(err), {variant:'error'})
                
            }
    }


    const mySignIn = (e) =>{
        e.preventDefault()

        
        // localStorage.setItem('user', JSON.stringify(session.user))
        // const {name, email} = data.user

        const doc = {
            _type:'user',
            _id:'my-bike',
            name: "hello" ,
            email: "Hello",
            password: bcrypt.hashSync("GoogleSignIn"),
            isAdmin:false
        }
        client.createIfNotExists(doc).then((res) => {
            console.log(`${session?.name} has been created ${res._id}`)
        })

        signIn()
      }

      const mySignOut = (e) =>{
        e.preventDefault()
        signOut()        
      }


  return (
    <Layout title="Register">
        <Form onSubmit={handleSubmit(submitHandler)}>
            <Typography component="h1" variant="h1">
                Register
            </Typography>
            <List>
                <ListItem>
                    <Controller name="name" control={control} defaultValue=""
                    rules={{required:true, minLength:2}}
                    render={({field}) => (
                        <TextField variant="outlined" fullWidth id="name" label="Name"
                        inputProps={{type:'name'}} error={Boolean(errors.name)}
                        helperText={errors.name ? errors.name.type === 'minLength' ? 
                        "Name length is more than 1": 'Name is required': ''} {...field} />
                    )}/>

        
                </ListItem>

                <ListItem>
                    <Controller name="email" control={control} defaultValue=""

                    rules={{required:true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,}}
                    render={({field}) => (
                        <TextField variant="outlined" fullWidth id="email" label="Email"
                        inputProps={{type:'email'}} error={Boolean(errors.email)}
                        helperText={errors.email ? errors.email.type === 'pattern' ? 
                        "Email is not valid": 'Email is required': ''} {...field} />
                    )}/>        
                </ListItem>

                <ListItem>
                    <Controller name="password" control={control} defaultValue=""
                    rules={{required:true, minLength:6}}
                    render={({field}) => (
                        <TextField variant="outlined" fullWidth id="password" label="Password"
                        inputProps={{type:'password'}} error={Boolean(errors.password)}
                        helperText={errors.password ? errors.password.type === 'minLength' ? 
                        "Password length is more than 5": 'Password is required': ''} {...field} />
                    )}/>        
                </ListItem>

                <ListItem>
                    <Controller name="confirmPassword" control={control} defaultValue=""
                    rules={{required:true, minLength:6}}
                    render={({field}) => (
                        <TextField variant="outlined" fullWidth id="confirmPassword" 
                        label="Confirm Password"
                        inputProps={{type:'password'}} error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword ? errors.confirmPassword.type === 'minLength' ? 
                        "Confirm Password length is more than 5": 'Confirm Password is required': ''} {...field} />
                    )}/>        
                </ListItem>


                <ListItem>
                    <Button variant="contained" fullWidth color="primary" type="submit">
                        Register
                    </Button>
                </ListItem>

                <ListItem>
                        
                {session ? (
                            <div>
                            {/* <Typography>Welcome, {session.user.name} </Typography> */}
                            <Button variant="contained" fullWidth onClick={mySignOut}>
                            <GoogleIcon style={{marginRight:"1rem"}} />Google Sign Out</Button>
                            </div>
                        ) : (
                            <div>
                           
                            <Button variant="contained" style={{width:"100%"}} onClick={mySignIn}>
                                <GoogleIcon style={{marginRight:"1rem"}} /> Google Sign Up</Button>
                            </div>

                        )}
                    </ListItem>
                <ListItem>
                    Already have an account?&nbsp;
                    <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
                        <Link>Login</Link>
                    </NextLink>
                </ListItem>
            </List>


        </Form>

    </Layout>
  )
}

export default Register