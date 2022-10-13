import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Rating, Typography } from '@mui/material'
import NextLink from 'next/link'
import React from 'react'
import { urlFor } from '../lib/client'
import classes from '../utils/classes'

const Product = ({product, cartHandler}) => {
    const {name, image, slug, rating, price, discount} = product

      
  return (
    <Card sx={classes.productCard}>
        <NextLink href={`/product/${slug.current}`} passHref>
            <CardActionArea>
                <CardMedia component ="img" src={urlFor(image && image[0]).width(450).height(400).url()} />
                
                <CardContent>
                    <Typography>{name}</Typography>
                    <Rating name="size-small" value={rating} size="small" /> 

                    <div style={{display:"flex"}}>
                    <Typography style={{fontWeight:"bold"}}>${price}</Typography>
                    <Typography style={{textDecoration:"line-through", marginLeft:"1rem"}}>{discount > 0 ? `$${discount}`: ""}</Typography>
                    </div>

                </CardContent>

            </CardActionArea>
        </NextLink>
        <CardActions>
            
            <Button variant="contained" fullWidth color="primary" onClick={()=>cartHandler(product)}>
                Add to cart
            </Button>
        </CardActions>
        </Card>
  )
}

export default Product