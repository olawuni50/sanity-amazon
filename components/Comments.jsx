import { Button, Card, CardActions, CardContent, TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { Store } from '../context/Store'
import Form from './Form'

const Comments = () => {
    const {state:{userInfo}, dispatch} = useContext(Store)
    const [input, setInput] = useState('')

    

  return (
    <div>
        {/* <Form onSubmit={handleSubmit(submitHandler)}> */}
{userInfo ? (
    <Card style={{marginTop:"2rem"}} >
    <CardContent>
              <TextField value={input} onChange={(e) =>setInput(e.target.value)} id="outlined-multiline-flexible" fullWidth label="Type Comment" multiline maxColumns={10}/>
              </CardContent>
               
              <CardActions>
                <Button disabled={!input} variant="contained"> Send </Button>
              </CardActions>
                           
        </Card>

) : (
    <Typography component="h1">You must be logged in to comment on product</Typography>
)}
{/* </Form> */}


    </div>
  )
}

export default Comments