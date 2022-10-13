import { Button, Link, List, ListItem, TextField, Typography} from '@mui/material';
import React, { useContext, useEffect } from 'react'
import {useForm, Controller} from 'react-hook-form';
import Form from '../components/Form';
import Layout from "../components/Layout";
import {useSnackbar} from 'notistack'
import NextLink from 'next/link'
// import { dispatch } from 'react-hot-toast/dist/core/store';
import axios from 'axios';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import { Store } from '../context/Store';
import { getError } from '../utils/error';;
import GoogleIcon from '@mui/icons-material/Google';
import { client } from '../lib/client';
import { useSession, signIn, signOut } from "next-auth/react"

const login = () => {
    const {handleSubmit, control, formState:{errors}, } = useForm();
    const { data: session } = useSession();
    console.log(session)
    const router = useRouter()
    const {redirect} = router.query
    const {dispatch, state} = useContext(Store);
    const {userInfo} =state
    
    const {enqueueSnackbar} = useSnackbar();
  
    
    
    useEffect(() => {
        if(userInfo) {
            router.push(redirect || '/')
        }
    }, [router, userInfo, redirect])


    const submitHandler = async ({email, password}) =>{
        try {
            const {data} = await axios.post('/api/users/login',{
                 email, password
            })
            dispatch({type:'USER_LOGIN', payload:data});
            jsCookie.set('userInfo', JSON.stringify(data))
            router.push(redirect || '/')

        } catch (err) {
            enqueueSnackbar(getError(err), {variant:'error'})
        }
    }

    // const credentialResponse = (response) => {
    //     console.log(response)
    //     localStorage.setItem('user', JSON.stringify(response.credential))

    //     const {name, id, email} = response.credential

    //     const doc = {
    //         "_id": id,
    //         _type:'user',
    //         name: name,
    //         email: email
    //     }
    //     client.createIfNotExists(doc).then(() => {
    //         router.push('/')
    //     })
    //   }

      const mySignIn = (e) =>{
        e.preventDefault()

        signIn()
        // const {name, email} = session.user

        // const doc = {
        //     _id: id,
        //     _type:'user',
        //     name: name,
        //     email: email
        // }
        // client.createIfNotExists(doc).then((res) => {
        //     console.log(`${name} has been created`)
          
        // })
      }

      const mySignOut = (e) =>{
        e.preventDefault()
        signOut()        
      }


  return (
    <Layout title="Login">
        <Form onSubmit={handleSubmit(submitHandler)}>
            <Typography component="h1" variant="h1">
                Login
            </Typography>
            <List>
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
                    <Button variant="contained" fullWidth color="primary" type="submit">
                        Login
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
                                <GoogleIcon style={{marginRight:"1rem"}} /> Google Sign In</Button>
                            </div>

                        )}
                                
                </ListItem>


                <ListItem>
                    Do not have an account?&nbsp;
                    <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
                        <Link>Register</Link>
                    </NextLink>
                </ListItem>                
            </List>

        </Form>
    </Layout>
  )
}

export default login