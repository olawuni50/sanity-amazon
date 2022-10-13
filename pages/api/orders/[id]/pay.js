import axios from 'axios';
import nc from 'next-connect';
import { isAuth } from '../../../../utils/auth';


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
                    id: req.query.id,
                    set: {
                        isPaid: true, paidAt: new Date().toISOString(),
                        'paymentResult.id': req.body.id,
                        'paymentResult.status': req.body.status,
                        'paymentResult.email_address': req.body.payer.email_address,
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
   
    res.send({message:'Order Paid'})
})

export default handler;