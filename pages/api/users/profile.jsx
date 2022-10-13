import axios from 'axios';
import nc from 'next-connect';
import { signToken, isAuth } from '../../../utils/auth';



const handler = nc()

handler.use(isAuth);
handler.put(async(req, res) => {
    const projectId = 'mw7b13n3';
    const dataset = 'production';
    const token = process.env.NEXT_PUBLIC_SANITY_TOKEN
    
    
 await axios.post(`https://${projectId}.api.sanity.io/v2022-07-22/data/mutate/${dataset}`,
        {
            mutations: [
                {
                    patch: {
                    id: req.user._id,
                    set: {
                        name: req.body.name,
                        email: req.body.email
                    }
                }}
            ]
        },
        {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        }
    );
   

    const user = {
        _id: req.user._id,
        name:req.body.name,
        email: req.body.email,
        isAdmin:req.user.isAdmin,
    };
    const myToken = signToken(user);
    res.send({...user, myToken})
})

export default handler;