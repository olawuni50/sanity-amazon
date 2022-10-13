export default{
    name:'footer',
    title:"Footer",
    type:'document',
    fields:[
        {
            name:"discount",
            title:"Discount",
            type:"number"
        },

        {
            name:"largeText",
            title:"Large Text",
            type:"string"
        },

        {
            name:'smallText',
            title:"Small Text",
            type:"string"
        },

        {
            name:"button",
            title:"Button",
            type:"string"

        },

        {
            name:'image',
            title:"Image",
            type:'array',
            of:[{type: 'image'}],
            options:{
                hotspot:true,
            }
        },

    ]
}