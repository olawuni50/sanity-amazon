import { Alert, Box, Button, Card, CardActions, CardContent, Chip, CircularProgress, Divider, Grid, Link, List, ListItem, Rating, TextField, Typography } from '@mui/material';
import React, {useContext, useReducer, useState} from 'react'
import {useSnackbar} from 'notistack'
import Layout from '../../components/Layout';
import { client, urlFor } from '../../lib/client';
import NextLink from "next/link"
import {useRouter} from 'next/router';
import classes from '../../utils/classes';
import { Store } from '../../context/Store';
import Product from '../../components/Product';
import {useForm, Controller} from 'react-hook-form';
import Form from '../../components/Form';
import {FacebookShareButton, FacebookIcon, PinterestShareButton,
    PinterestIcon, RedditShareButton, RedditIcon, TwitterShareButton,TwitterIcon,
    WhatsappShareButton, WhatsappIcon,} from 'next-share';
import Comments from '../../components/Comments';


    function reducer(state, action) {
        switch (action.type) {
          case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
          case 'FETCH_SUCCESS':
            return { ...state, loading: false, comment: action.payload, error: '' };
          case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
          default:
            state;
        }
      }

    //   const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    //     loading: true,
    //     orders: [],
    //     error: '',
    //   });


const ProductDetails= ({product, products, error, loading}) => {
    // const {image, name, category, description, price, countInStock, title, slug, numReviews, brand, rating} = product;
    const [index, setIndex] = useState(0)
    const router = useRouter()
    const {state:{cart, userInfo}, dispatch} = useContext(Store)
    const [input, setInput] = useState('')
    const {handleSubmit, control, formState:{errors}, } = useForm();

    const {enqueueSnackbar} = useSnackbar();
    

    const cartHandler = async () => {
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

    const submitHandler =async (e) =>{
        e.preventDefault()
        try {
            const {data} = await axios.post('/api/products/comment', {
                headers: { authorization: `Bearer ${userInfo.token}` },
            })

            dispatch({type: comment, payload:data})

        } catch (err) {
            enqueueSnackbar(getError(err), {variant:'error'})
        }

    }

  return (
    <Layout title={product?.title}>
        {loading ? (
            <CircularProgress />
        )
    : error ? (
        <Alert variant="error">{error}</Alert>
    ) : 
    (
        <Box>

            <Box sx={classes.section}>
                <NextLink href="/" passHref>
                        <Link>
                        <Typography>back to result</Typography>
                        </Link>
                    </NextLink>
            </Box>
            
            <Grid container spacing ={2}>
                <Grid item md={6} xs={12}>
                    <img src ={urlFor(product.image && product.image[index]).width(300).height(300).url()} className="product-detail-image" />

                    <Typography component="div" >
                {product.image?.map((item, i) =>(
                        <img src={urlFor(item)} key={item._key} className={i ===index? 'small-image selected-image' : 'small-image'} 
                        onMouseEnter={() => setIndex(i)} />
                    ))}
                </Typography>
                   
                </Grid>
    

                <Grid item md={3} xs={12}>
                    <List>
                        <ListItem>
                            <Typography  component="h4" variant="h4">{product.name}</Typography>
                        </ListItem>

                        <ListItem>
                            Category: {product.category}
                        </ListItem>

                        <ListItem>
                            Brand: {product.brand}
                        </ListItem>

                        <ListItem>
                        <Rating name="size-small" value={product.rating} size="small" /> 
                        <Typography>{product.numReviews} reviews</Typography>
                        </ListItem>
                        <ListItem>
                            Description: {product.description }
                        </ListItem>

                        {/* <ListItem>
                            <Typography variant="h2">Verified Customer Feedback</Typography>
                        </ListItem> */}

                    </List>
                </Grid>
                <Grid item md={3} xs={12} style={{marginBottom:'3rem'}}>
                    <Card>
                        <List>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Price:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>${product.price}</Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>

                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Status:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={product.countInStock > 0 ? classes.inStock: classes.outStock}>{product.countInStock > 0 ? "In Stock": "Out of Stock"}</Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            
                            <ListItem >
                                <Button onClick={cartHandler} variant="contained" fullWidth>Add to cart</Button>
                            </ListItem>

                        </List>
                    </Card>
                </Grid>              

            </Grid>
            <Divider> <Chip label="SHOPIT"  />  </Divider>

            <Grid container spacing={3}>

                <Grid item md={5} xs={12}>
                <Typography variant="h6" style={{marginTop:"1rem", marginBottom:"12px"}}>SHARE THIS PRODUCT</Typography>

<FacebookShareButton url={`https://localhost:3000/product/${product.slug.current}`} title={'Check out this product on ShopIt'}>
      <FacebookIcon style={{marginRight:"10px"}} size={32} round />
      </FacebookShareButton>

      <WhatsappShareButton url={`https://localhost:3000/product/${product.slug.current}`} title={'Check out this product on ShopIt'} separator=":: ">
          <WhatsappIcon style={{marginRight:"10px"}} size={32} round />
          </WhatsappShareButton>


      <TwitterShareButton  url={`https://localhost:3000/product/${product.slug.current}`} title={'Check out this product on ShopIt'} >
          <TwitterIcon style={{marginRight:"10px"}} size={32} round /> 
          </TwitterShareButton>


      <PinterestShareButton url={`https://localhost:3000/product/${product.slug.current}`} title={'Check out this product on ShopIt'}>
         <PinterestIcon style={{marginRight:"10px"}} size={32} round /> </PinterestShareButton>

         <RedditShareButton url={`https://localhost:3000/product/${product.slug.current}`} title={'Check out this product on ShopIt'}>
             <RedditIcon size={32} round />
             </RedditShareButton>


                    </Grid>

                    <Grid item  md={7} xs={12} style={{marginBottom:'3rem'}}>
                    <Typography variant="h6" style={{marginTop:"1rem", marginBottom:"12px"}}> VERIFIED CUSTOMER COMMENT</Typography>

                    <Comments />
                    </Grid>
                              

                </Grid>      
            
                <Divider> <Chip label="SHOPIT" />  </Divider>
             <Typography variant="h1" component="h1" style={{textAlign: 'center', marginTop:"3rem",  fontWeight:"bold"}}>
                You may also like</Typography>

            <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item md={3} key={product.slug}>
            <Product product={product} />
          </Grid>
          
        ))}
      </Grid>
      
        </Box>
    )}

    </Layout>
   
  )
}


export const getStaticPaths = async () => {
    const query = `*[_type == "product"]{slug{current}}`

    const products = await client.fetch(query);
    const paths = products.map((product) =>({
        params:{
            slug:product.slug.current
        }
    }))

    return{
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({params:{slug}}) =>{
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type =="product"]'

    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery);
    const loading = false;
    const error = ''

    console.log(product);

    return{
        props:{product, products, loading, error}
    }

}

export default ProductDetails