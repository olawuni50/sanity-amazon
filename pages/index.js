import React, { useContext } from 'react'
import {Alert, Button, CircularProgress, Grid, Typography} from "@mui/material"
import Layout from "../components/Layout"
import { client, urlFor } from '../lib/client'
import {useSnackbar} from 'notistack'
import Product from '../components/Product'
import HeroBanner from '../components/HeroBanner'
import { Store } from '../context/Store'
import {useRouter} from 'next/router'
import classes from '../utils/classes'
import Footer from '../components/Footer'
import { BallTriangle } from  'react-loader-spinner'

const Home = ({products, bannerData, footerData, loading, error}) => {
  const {state:{cart}, dispatch} = useContext(Store)
  const {enqueueSnackbar} = useSnackbar();
  const router = useRouter()


  const cartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x._id === product._id) 
    const quantity = existItem ? existItem.quantity + 1 : 1;
  
    
    if(product.countInStock < quantity){
        enqueueSnackbar('Sorry, Product is out of stock', {variant: 'error'});
     
        return
    }

    dispatch({
        type:'CART_ADD_ITEM',
        payload:{
            _key: product._id,
            name: product.name,
            countInStock: product.countInStock,
            slug: product.slug.current,
            price: product.price,
            image: urlFor(product.image),
            quantity,
            
        }
    })

    enqueueSnackbar(`${product.name} added to the cart`, {variant: 'success'})
    router.push('/cart')
}
  
  return (
    <Layout>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
      <Typography variant="h1" sx={classes.top}>Featured Products</Typography>
      {loading ? (
      <BallTriangle height={100} width={100} radius={5}
      color="#4fa94d"
      ariaLabel="ball-triangle-loading"
      wrapperClass={{}}
      wrapperStyle=""
      visible={true}
    />
      )
      // : error ? (
      // <Alert variant="danger">{error}</Alert>
      // )
    : (
      <div>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item md={3} key={product._id}>
            <Product product={product} cartHandler={cartHandler}/>
          </Grid>
        ))}
      </Grid>
      {/* <Button variant="contained" fullWidth style={{backgroundColor:"#700414", color:"#fff"}}>Mobiles</Button> */}
      <Footer footerBanner ={footerData.length && footerData[0]} />
      </div>
      
    )}
      </Layout>
  )
}

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query)

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  const footerQuery = '*[_type == "footer"]';
  const footerData = await client.fetch(footerQuery);

  const loading = false
  const error = ""

  return{
    props:{products, bannerData, footerData, loading, error}
  }
}
export default Home