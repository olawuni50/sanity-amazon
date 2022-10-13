import axios from 'axios';
import nc from 'next-connect';
import { isAuth } from '../../../utils/auth';


const handler = nc();

handler.use(isAuth);

handler.post(async(req, res) => {

    const projectId = 'mw7b13n3';
    // const projectId = process.env.NEXT_PROJECT_ID;
    const dataset = "production";
    const token = process.env.NEXT_PUBLIC_SANITY_TOKEN;

    const {data} = await axios.post(`https://${projectId}.api.sanity.io/v2022-07-08/data/mutate/${dataset}?returnIds=true`,

    {
        mutations:[
            {
                create: {
                    _type: 'order', createdAt: new Date().toISOString(), ...req.body,
                    userName: req.user.name,
                    user: {
                        _type: 'reference', 
                        _ref: req.user._id,
                    }
                }
            }
        ]
    },
    
    {
        headers:{
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${token}`,
        }
    });

    res.status(201).send(data.results[0].id)

})

export default handler