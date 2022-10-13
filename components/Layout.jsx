import React, { useContext, useEffect, useState } from 'react'
import Head from "next/head"
import {createTheme} from "@mui/material/styles"
import {Typography, Link, CssBaseline, ThemeProvider, Toolbar, AppBar, Container, Box, 
    Switch, createMuiTheme, Badge, Button, Menu, MenuItem, IconButton, Drawer, List, 
    ListItem, Divider, ListItemText, useMediaQuery, InputBase} from '@mui/material';
import classes from '../utils/classes'
import NextLink from 'next/link'
import { Store } from '../context/Store';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { getError } from '../utils/error';
import { useSnackbar } from 'notistack';
import { useSession, signIn, signOut } from "next-auth/react"


const Layout = ({children, title, description}) => {
    const {state, dispatch} = useContext(Store)
    const {darkMode, cart, userInfo} = state;
    const { data: session } = useSession();
    const [anchorEl, setAnchorEl] = useState(null)
    const router = useRouter()
    const {enqueueSnackbar} = useSnackbar()

    const loginMenuCloseHandler = (e, redirect) => {
        setAnchorEl(null);
        if(redirect) {
            router.push(redirect);
        }
    }

    const loginClickHandler = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const logoutClickHandler =() => {
        setAnchorEl(null);
        dispatch({type: 'USER_LOGOUT'});
        jsCookie.remove('userInfo');
        jsCookie.remove('cartItems');
        jsCookie.remove('shippingAddress');
        jsCookie.remove('paymentMethod');
        router.push('/')
    }


    const theme = createTheme({
        components:{
            MuiLink:{
                defaultProps:{
                    underline:'hover',
                }
            },
        },
        typography:{
            h1:{
                fontSize: '1.6rem',
                fontWeight:400,
                margin:'1rem 0',
            },

            h2:{
                fontSize:'1.4rem',
                fontWeight:400,
                margin:'1rem 0',
            },
            fontFamily:[
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"'
            ].join(',')
        },
        palette:{
            mode: darkMode ? 'dark' : 'light',
            primary:{
                main:'#f0c000',
                // main:'#700414',
            },
            secondary:{
                main: '#208080',
                // main: '#0C344E',
            }
        }
    })

    
    const darkModeChangeHandler = () => {
        dispatch({type: darkMode ? 'DARK_MODE_OFF': 'DARK_MODE_ON'});
        const newDarkMode = !darkMode;
        Cookies.set('darkMode', newDarkMode ? 'ON': 'OFF');
    }


    const [sidebarVisible, setSidebarVisible] = useState(false);

    const sidebarOpenHandler = () =>{
        setSidebarVisible(true);
    };

    const sidebarCloseHandler = () =>{
        setSidebarVisible(false);
    };

    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchCategories = async () =>{
            try {
                const {data} = await axios.get('/api/products/categories');
                setCategories(data);
                
            } catch (err) {
                enqueueSnackbar(getError(err), {variant:'error'})
            }
        }
        fetchCategories();
    }, [enqueueSnackbar]) 

    
    const isDesktop = useMediaQuery('(min-width:600px)');

    const [query, setQuery] = useState('');

    const queryChangeHandler = (e) => {
        setQuery(e.target.value);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        router.push(`/search?query=${query}`);
    }

    const mySignOut = (e) =>{
        e.preventDefault();
        
        signOut()
        
      }


      

  return ( 
    <div>
    <Head>
            <title>{ title ? `${title} - ShopIT` : 'ShopIT | Best Ecommerce Store'}</title>
            {/* <script src="https://apis.google.com/js/platform.js" async defer></script> */}
            {description && <meta name="description" content={description}> </meta>}
            
            
        </Head>
        

        <ThemeProvider theme={theme}>
     
            <CssBaseline />
            <AppBar position="static" sx={classes.appbar}>
                <Toolbar sx={classes.toolbar}>

                        <Box display="flex" alignItems="center">  

                        <IconButton edge="start" aria-label='open drawer'
                        onClick={sidebarOpenHandler} sx={classes.menuButton}>

                            <MenuIcon sx={classes.navbarButton} />                                

                            </IconButton>

                        <NextLink href="/" passHref>    
                        <Link>
                        <Typography sx={classes.brand}>ShopIT</Typography>
                        </Link>
                        </NextLink>
                        </Box>

                        <Drawer anchor="left" open={sidebarVisible} onClose={sidebarCloseHandler}>
                            <List>

                                <ListItem>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Typography>Shopping by category</Typography>
                                        <IconButton aria-label="close" onClick={sidebarCloseHandler}>
                                            <CancelIcon/>
                                        </IconButton>
                                    </Box>
                                </ListItem>

                                <Divider light />

                                {categories.map((category) => (
                                    <NextLink key={category} href={`/search?category=${category}`} passHref>
                                        <ListItem button component="a" onClick={sidebarCloseHandler}>
                                            <ListItemText primary={category}>

                                            </ListItemText>
                                        </ListItem>
                                    </NextLink>
                                ))}

                                </List>
                        </Drawer>

                        <Box sx={isDesktop ? classes.visible : classes.hidden}>
                            
                            <form onSubmit={submitHandler}>
                                <Box sx={classes.searchForm}>
                                    <InputBase name="query" sx={classes.searchInput} placeholder="Search products" 
                                    onChange={queryChangeHandler} />
                                    <IconButton type="submit" sx={classes.searchButton} aria-label="search">
                                        <SearchIcon />
                                    </IconButton>
                                </Box>
                            </form>

                        </Box>
                        
                        <Box display="flex">
                        <Switch checked={darkMode}  onChange={darkModeChangeHandler} />               
                        <NextLink href="cart" passHref>
                            <Link>
                            <Typography style={{cursor:"pointer"}}> 
                                {cart.cartItems.length > 0 ? (
                                    <Badge color="secondary"
                                    badgeContent={cart.cartItems.length}>
                                        <ShoppingCart />
                                    </Badge>
                                ): (
                                   
                                        <ShoppingCart />
                                    
                                )}
                            </Typography>
                            </Link>
                        </NextLink>

                        {userInfo ? 
                            <>
                            <Button aria-controls="simple-menu" aria-haspopup="true"
                            sx={classes.navbarButton} onClick={loginClickHandler} >
                                {userInfo?.name}
                            </Button>
                            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={loginMenuCloseHandler}>
                                <MenuItem onClick={(e) =>loginMenuCloseHandler(e, '/profile')}>Profile</MenuItem>
                                <MenuItem onClick={(e) =>loginMenuCloseHandler(e, '/orderHistory')}>Order History</MenuItem>
                                <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>

                            </Menu>
                            </>
                         : session ? 
                                <>
                                <Button aria-controls="simple-menu" aria-haspopup="true"
                                sx={classes.navbarButton} onClick={loginClickHandler} >
                                    {session?.user?.name}
                                </Button>
                                <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={loginMenuCloseHandler}>
                                
                                    <MenuItem onClick={(e) =>loginMenuCloseHandler(e, '/orderHistory')}>Order History</MenuItem>
                                    <MenuItem onClick={mySignOut}>Logout</MenuItem>
    
                                </Menu>
                                </>                                                                              
                         : (
                            <>
                            <NextLink href="/login" passHref>
                            <Link>Login</Link>
                        </NextLink>
                        </>
                        )}

                        
                        </Box>
                </Toolbar>
            </AppBar>


            <Container component="main" sx={classes.main}>
                {children}
            </Container>


            <Box component="footer" sx={classes.footer}>
                <Typography>All rights reserved. ShopIt</Typography>
            </Box>

        </ThemeProvider>
    </div>
  )
}

export default Layout

// https://www.npmjs.com/package/@sanity/client
// https://stackoverflow.com/questions/71982276/how-to-create-a-new-user-along-with-their-profile-images-in-sanity