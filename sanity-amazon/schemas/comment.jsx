import { CommentIcon } from '@sanity/icons'
export default{
    name:'comment',
    title:"Comment",
    type:"document",
    icon: CommentIcon,
    fields: [
        {
            name: 'user',
            title:"User",
            type:'reference',
            to:{
                type:'user'
            }
            
    },

    {
        name:'product',
        title:'Product',
        type:'reference',
        to: {
          type:'product'
        }
    },
 
        {
            name:'comment',
            title:'Comment',
            type:'text'
        }
    ]
}


// import { CommentIcon } from '@sanity/icons'

// export default {
//   name: 'comment',
//   type: 'document',
//   title: 'Comment',
//   icon: CommentIcon,
//   fields: [
//     {
//       name: 'name',
//       type: 'reference',
//       to: {
//         type:'user'
//       }
//     },
//     {
//       title: 'Approved',
//       name: 'approved',
//       type: 'boolean',
//       description: "Comments won't show on the site without approval",
//     },
//     {
//       name: 'email',
//       type: 'string',
//     },
//     {
//       name: 'comment',
//       type: 'text',
//     },
//     {
//       name: 'product',
//       type: 'reference',
//       to: [{ type: 'product' }],
//     },
//   ],
//   preview: {
//     select: {
//       name: 'name',
//       comment: 'comment',
//       product: 'product.name',
//     },
//     prepare({ name, comment, product }) {
//       return {
//         title: `${name} on ${product}`,
//         subtitle: comment,
//       }
//     },
//   },
// }