import { Button, Container, Link, Typography } from '@mui/material'
import React from 'react'
import Layout from '../components/Layout'
import classes from '../utils/classes'
import NextLink from 'next/link'
import dynamic from 'next/dynamic'


const Custom404 = () =>{
    return(

        <Layout title="Error Page">
        <Container maxWidth="lg" sx={classes.error}>
            
        
        <Typography component="h1" variant="h1" style={{color:"red"}}>Oops!</Typography>
        <Typography component="p" variant="h5" style={{marginTop:"1rem", fontWeight:"bolder"}}>404 - PAGE NOT FOUND</Typography>
        <Typography component="p" variant="h6" style={{ marginTop:"1rem"}}>The page you are looking for might have 
        been removed had its name changed or is temporarily unavailable</Typography>

        <NextLink href="/" passHref>
            <Link>
        <Button variant="contained" sx={classes.buttonError}>GO BACK TO HOMEPAGE</Button>
        </Link>
        </NextLink>
       

            </Container>
            </Layout>
    )
}
export default dynamic(() => Promise.resolve(Custom404), {ssr:false})