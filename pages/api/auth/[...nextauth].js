import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import jwt from "next-auth/jwt"



export default NextAuth({  
    providers: [ 
      GoogleProvider({        
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        authorization:{
          params: {
            prompt: 'consent',
            access_type: "offline",
            response_type: "code"
          }
        }
      }),
    ],

    // jwt:{
    //   secret: process.env.JWT_SECRET,
    //   signingKey: {"kty":"oct","kid":"Dl893BEV-iVE-x9EC52TDmlJUgGm9oZ99_ZL025Hc5Q","alg":"HS512","k":"K7QqRmJOKRK2qcCKV_pi9PSBv3XP0fpTu30TP8xn4w01xR3ZMZM38yL2DnTVPVw6e4yhdh0jtoah-i4c_pZagA"},
    //   encryption: true,
    //   encryptionKey: ""
    // },    

    jwt:{
      secret: process.env.JWT_SECRET
    },

    
    session:{
      strategy: 'jwt',
      jwt: true
    },

    callbacks: {
        async redirect({ url, baseUrl }) {
          return "http://localhost:3000";
        },

      //   jwt: async ({ token, user }) => {
      //     user && (token.user = user)
      //     return token
      // },
      // session: async ({ session, token }) => {
      //     session.user = token.user
      //     return session
      // }

        
  
      async session({ session, token, user }) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
        return session;
      },
      async jwt({ token, user, account, profile, isNewUser }) {
        if (user) {
          token.id = user.id;
        }
        if (account) {
          token.accessToken = account.access_token;
        }
        return token;
      },
      },
      session: {
        strategy: 'jwt',

      },

    pages:{
        // New users will be directed to the page specify on first sign in
        newUser: '/'
    },

    // events:{
    //     signIn: ({user, account, profile, isNewUser}) => {
    //         console.log(`isNewUser: ${JSON.stringify(isNewUser)}`)
    //     }
    // },

    theme:{
      colorSchee: "dark",
      brandColor:"",
      logo:"",
      buttonText:""
    }


  })

// import NextAuth from 'next-auth'
// import Providers from 'next-auth/providers'

// const providers = [
//     Providers.Google({
//         clientId: process.env.GOOGLE_ID,
//         clientSecret: process.env.GOOGLE_SECRET
//     })
// ]

// const callbacks = {}

// callbacks.signIn = async function signIn(user, account, metadata) {
//     if (account.provider === 'google') {    
//         const googleUser = {
//             id: metadata.id,
//             login: metadata.login,
//             name: metadata.name,
//             avatar: user.image
//         }
    
//         user.accessToken = await getTokenFromYourAPIServer('google', googleUser)
//         return true
//     }

//     return false;
// }

// callbacks.jwt = async function jwt(token, user) {
//     if (user) {
//         token = { accessToken: user.accessToken }
//     }

//     return token
// }

// callbacks.session = async function session(session, token) {
//     session.accessToken = token.accessToken
//     return session
// }

// const options = {
//     providers,
//     callbacks
// }

// export default (req, res) => NextAuth(req, res, options)