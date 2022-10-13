 const classes = {
    heroContainer:{
        backgroundColor:"#DDDDDD",
        height:"50vh",
        borderRadius:"15px",
        lineHeight:"1.3",
        padding:"10px",
        display:"flex",
        justifyContent:"center",    
        position:"relative"        

    },
    productCard:{
       transform: "scale(1, 1)",
        transition: "transform 0.5s ease",
        '&:hover': {
            transform:"scale(1.02, 1.02)"
        }
    }, 
    inStock:{
        color:"green"
    },

    outStock:{
        color:"red"
    },
    section:{
        marginTop:1,
        marginBottom:1,

    },
    main: {
        marginTop: 2,
        minHeight: '80vh',
    },

    footer: {
        marginTop: 1,
        textAlign: 'center',
    },

    appbar: {
        backgroundColor:'#203040',
        '& a': {
            color: '#FFFFFF',
            marginLeft: 1,
        },
    },
    toolbar:{
        justifyContent:'space-between',
        // width:'100%',
    },
    brand:{
        fontWeight: 'bold',
        fontSize:'1.5rem',
        color:"#fff",
        cursor:"pointer"
    },
    navbarButton:{
        color:'#ffffff',
        textTransform: "initial"
    },

    top:{
        color:"#463F3A",
        fontWeight:"bolder",
        textAlign:"center",
        marginBottom:"2rem",
        marginTop:"2rem"
    },

    footerBase:{
        backgroundColor:"#f0c000",
        height:'40vh',
        borderRadius:"10px",
        marginTop:"5rem",
        marginBottom:"4rem",
        padding:"2rem",
        color:'#fff'
    },

    fullWidth: {
        width: '100%',
    },

   sort:{
    marginRight:1
   },

   visible:{
    display: 'initial'
   },

   hidden: {
    display:'none'
   },

   searchForm: {
    border: '1px solid #ffffff',
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
  searchInput: {
    paddingLeft: 1,
    color: '#000000',
    '& ::placeholder': {
      color: '#606060',
    },
  },
  searchButton: {
    backgroundColor: '#f8c040',
    padding: 1,
    borderRadius: '0 5px 5px 0',
    '& span': {
      color: '#000000',
    },
  },

  error:{
    marginTop:"10%",
    // marginLeft:"30%",
    textAlign:"center",
  },

  buttonError:{
        marginTop:"1rem"
  }
}

export default classes