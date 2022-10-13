import { Button, FormControl, FormControlLabel, List, ListItem, Radio, RadioGroup, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import CheckoutWizard from '../components/CheckoutWizard'
import Form from '../components/Form'
import jsCookie from 'js-cookie'
import Layout from '../components/Layout'
import { Store } from '../context/Store'
import { useSnackbar } from 'notistack'

const payment = () => {
    const [paymentMethod, setPaymentMethod] = useState('')
    const {state, dispatch} = useContext(Store)
    const {cart: {shippingAddress}, } = state;
    const router = useRouter()
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if(!shippingAddress.address){
            router.push('/shipping')
        }else {
            setPaymentMethod(jsCookie.get('paymentMethod') || '')
        }
    }, [router, shippingAddress])


    const submitHandler = (e) =>{
        e.preventDefault();
        if(!paymentMethod) {
            enqueueSnackbar("Payment method is required", {variant:"error"})

        }else {
            dispatch({type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod});
            jsCookie.set('paymentMethod', paymentMethod)
            router.push('/placeorder')
        }

    }


  return (
   <Layout title="Payment Method">

    <CheckoutWizard activeStep={2} />

    <Form onSubmit={submitHandler}>

        <Typography component="h1" variant="h1">
            Payment Method
        </Typography>

        <List>
            <ListItem>
                <FormControl component="fieldset">

                    <RadioGroup aria-label="Payment Method" name="paymentMethod" 
                    value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>

                        <FormControlLabel label="Paypal" value="PayPal" control={<Radio />} />
                        <FormControlLabel label="Stripe" value="Stripe" control={<Radio />} />
                        <FormControlLabel label="Cash" value="Cash" control={<Radio />} />

                    </RadioGroup>

                    </FormControl>
            </ListItem>

            <ListItem>
                <Button fullWidth type="submit" variant="contained" color="primary">
                    Continue 
                </Button>
            </ListItem>

            <ListItem>
                <Button fullWidth type="button" variant="contained" color="secondary"
                onClick={() => router.push('/shipping')}>
                    Back
                </Button>
            </ListItem>

        </List>

    </Form>
   </Layout>
  )
}

export default payment