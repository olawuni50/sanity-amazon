import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { signToken } from '../../../utils/auth';
import { client } from "../../../lib/client"


const handler = nc()

handler.post(async(req, res) =>{
   const projectId = process.env.NEXT_PROJECT_ID;
//    const projectId = 'mw7b13n3';
    const dataset = 'production';
    const token = process.env.NEXT_PUBLIC_SANITY_TOKEN

    // updating server in sanity
    const createMutations = [
        // list of mutations to update the sanity in database
        {
            create:{
                _type: 'user',
                name:req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password),
                isAdmin: false
            }
        }];

        const existUser = await client.fetch(`*[_type == 'user' && email == $email][0]`,{
            email: req.body.email,
        })
        if(existUser){
            return res.status(401).send({message: 'Email already exists'})
        }

        // calling an AJAX request (Make requests to the server without reloading the page, Receive and work with data from the server)
    const {data} = await axios.post(`https://${projectId}.api.sanity.io/v2022-08-15/data/mutate/${dataset}`,
    {mutations: createMutations}, 
    {
        headers:{
            'Content-type':'application/json',
            Authorization: `Bearer ${token}`
        }
    }
    );

    // new record 
    const userId = data.results[0].id;
    const user = {
        _id: userId,
        name:req.body.name,
        email: req.body.email,
        isAdmin:false,
    };
    const myToken = signToken(user);
    res.send({...user, myToken})
})

export default handler
