import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import User from "lib/models/User"
import bcrypt from "bcryptjs"
import dbConnect from "lib/mongoose"
import { authenticate } from "../credentials"

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        let user = await authenticate(credentials.username, credentials.password)

        if(user) {
          // console.log(user)
          return user
        }
        return null
      }
    })
  ],
  callbacks: {
    async session({session, token, user}) {
      // await dbConnect();
      // console.log(session)
      // console.log(token)
      // console.log(user)
      session.user = token.user
      // if(!token.user.data) {
      //   let userDat = await User.findOne({email: token.user.email})
      //   session.user.data = userDat
      // }
      return session
    },
    async jwt({token, user, account, profile}) {
      // console.log(token)
      if(user) {
        token.user = user
      }
      // console.log(account)
      // console.log(profile)
      return token
    }
  }
}

export default NextAuth(authOptions)
