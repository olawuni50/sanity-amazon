import { Button, Container, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import React from 'react'
import { urlFor } from '../lib/client'
import classes from '../utils/classes'


const HeroBanner = ({heroBanner:{image, buttonText, product,
smallText, midText, largeText1}}) => {


  return (
    <Container fullWidth sx={classes.heroContainer}>
      <div>
        <Typography variant="body1">{smallText}</Typography>
        <Typography variant="h3">{midText}</Typography>
        <Typography variant="h1" style={{color:"#f0c000"}}>{largeText1}</Typography>
        <Button variant="contained" style={{marginTop:'90px'}}>{buttonText}</Button>
        </div>

        <img src={urlFor(image)} alt="hot sale" className="hot-image"/>
       



    </Container>
  )
}

export default dynamic(() => Promise.resolve(HeroBanner), {ssr:false})
