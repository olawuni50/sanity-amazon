import React from 'react'
import {Box, Button, Component, Typography} from '@mui/material'
import classes from '../utils/classes'
import { urlFor } from '../lib/client'
import dynamic from 'next/dynamic'

const Footer = ({footerBanner}) => {
  return (
    <Box sx={classes.footerBase}>
        <Typography variant="body1">{footerBanner.discount}off </Typography>
        <Typography variant="h3">{footerBanner.largeText}</Typography>
        <Button variant="contained" style={{backgroundColor:"#208080", color:"#fff"}}>
            {footerBanner.button}</Button>

            {/* {
                footerBanner.image && ( <img src={urlFor(footerBanner.image).width(200)} />)
            } */}
            
       
        
        
    </Box>
  )
}

export default dynamic(() => Promise.resolve(Footer), {ssr:false})
