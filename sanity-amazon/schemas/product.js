export default{
    name:'product',
    title:"Product",
    type:'document',
    fields:[

        // {
        //     name:'user',
        //     title:'User',
        //     type:'reference',
        //     to :[{type: 'user'}],
        //     option:{disableNew:true}
        // },
        {
            name:'image',
            title:"Image",
            type:'array',
            of:[{type: 'image'}],
            options:{
                hotspot:true,
            }
        },

        {
            name:'name',
            title:"Name",
            type:'string',
        },

        {
            name:'slug',
            title:'Slug',
            type:'slug',
            options: {
                source:'name',
                maxLength: 90,
            }
        },

        {
            name:'price',
            title:'Price',
            type:'number'
        },

        {
            name:"discount",
            title:"Discount",
            type:"number"
        },

        {
            name:'description',
            title:'Description',
            type:'string'
        },

        {
            name:'brand',
            title:"Brand",
            type:'string'
        },

        {
            name:'category',
            title:'Category',
            type:'string',
        },

        {
            name:'rating',
            title:'Rating',
            type:'number'
        },

        {
            name:'numReviews',
            title:'NumReviews',
            type:'number' 
        },

        {
            name:'countInStock',
            title:'CountInStock',
            type:'number'
        },

        {
            name:'comments',
            title:'Comments',
            type: 'array',
            of: [{type: 'comment'}]
        }
    ]
}