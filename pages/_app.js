import React from 'react'
import '../styles/globals.css'
import createCache from '@emotion/cache'
import {CacheProvider} from "@emotion/react";
import Layout from '../components/Layout';
import { StoreProvider } from '../context/Store.jsx';
import { SnackbarProvider } from 'notistack';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SessionProvider } from "next-auth/react"

const clientSideEmotionCache = createCache({key:'css'});

function MyApp({ Component, session, pageProps, emotionCache =clientSideEmotionCache }) {
// function MyApp({ Component, session, pageProps, emotionCache =clientSideEmotionCache }) {
  return (
   
    <CacheProvider value={emotionCache}>
    <SessionProvider session={session}>
      <SnackbarProvider anchorOrigin={{vertical:'top', horizontal:"center"}}>
      <StoreProvider>
      <PayPalScriptProvider deferLoading={true}>
      
       <Component {...pageProps} /> 
       
       </PayPalScriptProvider> 

     </StoreProvider>
     </SnackbarProvider>
     </SessionProvider>
    </CacheProvider>
   
 )
  
}

export default MyApp
