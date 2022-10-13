import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { signToken } from '../../../utils/auth';
import { client } from "../../../lib/client"

const handler = nc()

handler.post(async(req, res) =>{
    // fetching user based on the email in the db(here is the query to get user from sanity in our next js api)
    const user = await client.fetch(`*[_type == 'user' && email == $email][0]`,{
        email: req.body.email,
    })

    // comparing new users password and the one in the database(user.password)
    if(user && bcrypt.compareSync(req.body.password, user.password)){
        // sending user information in the db to the token
        const token = signToken({
            _id: user._id,
            name:user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })

        res.send({
            _id: user._id,
            name:user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token
        })
    }else{
        res.status(401).send({message:'Invalid Email or password'})
    }
    res.send({
        _id: user._id,
        name:user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token
    })
})

export default handler

