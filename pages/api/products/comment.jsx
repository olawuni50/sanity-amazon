// import nc from 'next/connect'

import { client } from "../../../lib/client"


// const handler = nc()

// handler.post(async(req, res) =>{
//     const projectId = 'mw7b13n3';
//     // const projectId = process.env.NEXT_PROJECT_ID;
//     const dataset = "production";
//     const token = process.env.NEXT_PUBLIC_SANITY_TOKEN;

//     const {data} = await axios.post(`https://${projectId}.api.sanity.io/v2022-07-08/data/mutate/${dataset}`,
//     {
//         mutations: [
//             {
//                 create:{
//                     _type:'comments', 
//                     userName: req.user.name,
//                     ...req.body,
//                     user:{
//                         _type: 'reference',
//                         _ref: req.user._id
//                     }
//                 }
//             }
//         ]
//     },

//     {
//         headers:{
//             'Content-Type': 'application/json', 
//             Authorization: `Bearer ${token}`,
//         }
//     }
    
//     )

//     res.send(data.results[0].id)



// })


export default async function createComment(req, res) {
  const { _id, name, email, comment } = JSON.parse(req.body)
  try {
    await client.create({
      _type: 'comment',
      product: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      comment,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: `Couldn't submit comment`, err })
  }
  return res.status(200).json({ message: 'Comment submitted' })
}