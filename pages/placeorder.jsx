import { Button, Card, CircularProgress, Grid, Link, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout';
import Image from "next/image"
import { Store } from '../context/Store'
import NextLink from "next/link"
import classes from '../utils/classes';
import axios from "axios";
import jsCookie from 'js-cookie'
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import { urlFor } from '../lib/client';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react'
import useSWR from 'swr'


const fetcher = url => axios.get(url).then(res => res.data)

const placeorder = () => {
    const {state, dispatch} = useContext(Store);
    const {userInfo, cart:{cartItems, shippingAddress, paymentMethod}} = state;
    const router = useRouter()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON)/100
    const itemsPrice = round2(
        cartItems.reduce((a,c) => a + c.price * c.quantity, 0)
    )

    const shippingPrice = itemsPrice > 200 ? 15 : 0; 
    const taxPrice = round2(itemsPrice * 0.15);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    // useEffect(() =>{
    //     if(!paymentMethod) {
    //         router.push('/payment');
    //     }
    //     if(cartItems.length === 0){
    //         router.push('/cart');
    //     }
    // }, [ paymentMethod, router]);

    useEffect(() =>{
        if(!userInfo){
            return router.push("/login?redirect=/cart")
        }
    })


    const { data: session } = useSession()
    console.log(session)

    


    const placeOrderHandler = async () => {

        try{
            setLoading(true)
            const {data} = await axios.post('/api/orders',
            {
                orderItems: cartItems.map((x) => ({
                    ...x, 
                    countInStock: undefined,
                    slug: undefined,
                })),
                shippingAddress,
                paymentMethod, 
                itemsPrice, 
                shippingPrice,
                taxPrice,
                totalPrice
            },
            
            
            {
                headers:{
                    authorization: userInfo ? `Bearer ${userInfo.token}` : `Bearer ${session.accessToken}`,
                    // Authorization: `Bearer ${data?.accessToken}`
                }
            })
            dispatch({type: 'CART_CLEAR'});
            jsCookie.remove('cartItems');
            setLoading(false);
            router.push(`/order/${data}`);

        }catch(err) {
            setLoading(false);
            enqueueSnackbar(getError(err), {variant:'error'});
        }
    }

      

  return (
    <Layout title="Place Order">
        <CheckoutWizard activeStep={3}/>
        <Typography components="h1" variant="h1">
            Place Order
        </Typography>

        <Grid container spacing={1}>
            <Grid item  md={9} xs={12}>
                <Card sx={classes.section}>
                    <List>

                        <ListItem>
                            <Typography component="h2" variant="h2">
                                    Shipping Address
                                </Typography>
                        </ListItem>

                        <ListItem>
                           {shippingAddress.fullName} {shippingAddress.address},{' '}
                            {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                            {shippingAddress.country}
                        </ListItem>
                        
                            <ListItem>
                                <Button onClick={()=>router.push('/shipping')} 
                                variant="contained" color="secondary">Edit</Button>
                            </ListItem>
                        
                    </List>

                </Card>


                <Card sx={classes.section}>
                    <List>

                        <ListItem>
                            <Typography component="h2" variant="h2">
                                    Payment Method
                                </Typography>
                        </ListItem>

                        <ListItem>
                            {paymentMethod}
                        </ListItem>
                        
                            <ListItem>
                                <Button onClick={()=>router.push('/payment')} variant="contained" 
                                color="secondary">Edit</Button>
                            </ListItem>
                        
                    </List>

                </Card>

                <Card sx={classes.section}>
                    <List>

                        <ListItem>
                            <Typography component="h2" variant="h2">
                                    Order Items
                                </Typography>
                        </ListItem>

                        <ListItem>
                           <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Image</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="left">Quantity</TableCell>
                                        <TableCell align="left">Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cartItems.map((item) =>(
                                        <TableRow key={item._key}>

                                            <TableCell> 
                                                <NextLink href={`/product/${item.slug}`} passHref>
                                                    <Link>
                                                    {/* <Image src={item.image} alt={item.name} width={50} height={50} /> */}
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

                                            <TableCell>                                                                                                  
                                                    <Typography>{item.quantity}</Typography>     
                                            </TableCell>

                                            <TableCell>                                                                                                  
                                                    <Typography>${item.price}</Typography>     
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                           </TableContainer>
                        </ListItem>                        
                    </List>
                </Card>
            </Grid>
            
            <Grid item md={3} xs={12}>
                <Card sx={classes.section}>
                    <List>
                        <ListItem>
                            <Typography variant="h2">Order Summary</Typography>
                        </ListItem>

                        <ListItem>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography>Items:</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography align="right" style={{fontWeight:"bolder"}}>${itemsPrice}</Typography>
                                </Grid>
                            </Grid>
                        </ListItem>

                        <ListItem>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography>Shipping:</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography align="right" style={{fontWeight:"bolder"}}>${shippingPrice}</Typography>
                                </Grid>                                
                            </Grid>
                        </ListItem>

                        <ListItem>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography>Tax:</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography align="right" style={{fontWeight:"bolder"}}>${taxPrice}</Typography>
                                </Grid>                                
                            </Grid>
                        </ListItem>

                        <ListItem>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography>Total:</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography align="right" style={{fontWeight:"bold"}}>${totalPrice}</Typography>
                                </Grid>                                
                            </Grid>
                        </ListItem>

                        <ListItem>
                            <Button onClick={placeOrderHandler} variant="contained" color="primary" 
                            fullWidth disabled={loading}>Place Order</Button>
                        </ListItem>
                        {loading && (
                            <ListItem>
                                <CircularProgress />
                            </ListItem>
                        )}

                    </List>
                </Card>

                </Grid>

        </Grid>


        </Layout>
  )
}

export default dynamic(() => Promise.resolve(placeorder), {ssr:false});