import React from "react";
import Document, {Head, Html, Main, NextScript} from 'next/document';
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'
import Script from 'next/script'

export default class MyDocument extends Document {
    render(){
        return(

            <Html lang='en'>

                <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                <link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@300&family=Gentium+Plus&family=Roboto:wght@400&display=swap" rel="stylesheet"/>
                {/* <script src="https://apis.google.com/js/platform.js" defer /> */}
                {/* <script src="https://accounts.google.com/gsi/client"  defer></script> */}                
                </Head>
                
                <body>
                    <Main />
                    <NextScript />                    
                </body>
                
            </Html>
        )
    }
}

MyDocument.getInitialProps = async (ctx) => {
    const originalRenderPage = ctx.renderPage;
    const cache = createCache({key:'css'})
    const {extractCriticalToChunks} = createEmotionServer(cache);
    ctx.renderPage = () => 
    originalRenderPage({
        enhanceApp: (App) =>(props) => <App emotionCache={cache} {...props} />
    })

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html); 

    const emotionStyleTags = emotionStyles.styles.map((style) => {
        <style data-emotion={`${style.key} ${style.ids.join('')}`} key={style.key}
    dangerouslySetInnerHTML={{_html: style.css}} />

    });

    return {
        ...initialProps, 
        styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags]
    }    
}