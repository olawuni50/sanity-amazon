import { Box, Button, Card, CardActionArea, CardMedia, Grid, Link, List, ListItem, MenuItem, Select, 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import NextLink from "next/link"
import {useSnackbar} from 'notistack'
import Layout from '../components/Layout'
import dynamic from 'next/dynamic'
import { Store } from '../context/Store'
import Image from 'next/image'
import { urlFor } from '../lib/client'
import { useRouter } from 'next/router'
import axios from 'axios'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';




const cart = () => {
    const {state:{cart, userInfo}, dispatch} = useContext(Store)
    const {enqueueSnackbar} = useSnackbar();
    const router = useRouter()


    
    const updateCartHandler = async (item, quantity) =>{      
       
        if(item.countInStock < quantity){
            enqueueSnackbar('Sorry, Product is out of stock', {variant: 'error'});
         
            return
        }

        dispatch({
            type:'CART_ADD_ITEM',
            payload:{
                _key: item._key,
                name: item.name,
                countInStock: item.countInStock,
                slug: item.slug,
                price: item.price,
                image: item.image,
                quantity,
                
            }
        })

        enqueueSnackbar(`${item.name} updated in the cart`, {variant: 'success'})
        
    }

    

    const removeItemHandler = (item) =>{
        dispatch({type: 'CART_REMOVE_ITEM', payload: item})
    }

  return (
    <Layout title="Shopping Cart">
        <Typography component="h2" variant="h2">
            Shopping Cart
        </Typography>
        {cart.cartItems.length === 0 ? 
        <Box style={{textAlign:"center", marginTop:"5rem"}} >
            <ShoppingCartCheckoutIcon style={{fontSize:"15rem", color:"#208080"}} />
            <Typography variant="h1">Cart is empty</Typography>
                <NextLink href="/" passHref>
                    <Link>
                    <Button variant="contained" style={{fontWeight:"bolder", width:"40%"}}>Go Shopping</Button>

                    </Link>
                </NextLink>
            
        </Box>: (
            <Grid container spacing={1}>
                <Grid item md={9} xs={12}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell >Name</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Action</TableCell>                                     
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {cart.cartItems.map((item) => (
                                    <TableRow key={item._key}>

                                        <TableCell>
                                            <NextLink href={`/product/${item.slug}`} passHref>
                                                <Link>
                                                <>
                                                {/* <img src={urlFor(item.image)} alt={item.name}/> */}
                                                {/* <Image src={urlFor(item.image)} alt="product image" width={50} height={50} />  */}
                                                </>                                                             

                                                </Link>
                                            </NextLink>
                                        </TableCell>

                                        <TableCell>
                                            <NextLink href={`/product/${item.slug}`} passHref>
                                                <Link>
                                                <Typography>{item.name}</Typography>
                                                </Link>
                                            </NextLink>
                                        </TableCell>

                                        <TableCell align='right'>
                                            <Select value={item.quantity} 
                                            onChange={(e) => updateCartHandler(item, e.target.value)}>
                                               {[...Array(item.countInStock).keys()].map((x) => (
                                                <MenuItem key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </MenuItem>
                                               ))} 

                                            </Select>
                                        </TableCell>
                                        
                                        <TableCell align='right'>
                                            <Typography >${item.price}</Typography>
                                        </TableCell>
                                        
                                        <TableCell align='right'>
                                            <Button variant="contained" color="secondary" 
                                            onClick={() =>window.confirm(`Do you really want to remove this item from cart?`) && 
                                            removeItemHandler(item)}>
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item md={3} xs={12}>
                    <Card>
                        <List>
                            <ListItem>
                                <Typography component="h1" variant="h2">
                                    Subtotal ({cart.cartItems.reduce((a,c) => a + c.quantity, 0)}{' '}
                                    items): ${cart.cartItems.reduce((a,c) => a + c.quantity * c.price, 0 )}
                                </Typography>
                            </ListItem>

                            <ListItem>
                                <Button onClick={() => {router.push('/shipping')}} fullWidth color="primary" variant="contained">
                                    Checkout</Button>
                            </ListItem>
                        </List>
                    </Card>

                </Grid>

            </Grid>
        )
    }

    </Layout>
  )
}

export default dynamic(() => Promise.resolve(cart), {ssr:false})
// export default cart