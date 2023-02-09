import User from "lib/models/User";
import bcrypt from "bcryptjs"
import dbConnect from "lib/mongoose";

export default async function handler(req, res) {

}

export async function authenticate(username, password) {
  await dbConnect();
    let user = await User.findOne({username: username})
    // console.log(user)
    if(!user) {
        return null;
    } else {
        // bcrypt.compare(password, user.password, (err, res) => {
        // if(err) {
        //     console.log(err)
        //     return null;
        // }
        // if(res){
        //     // console.log(user)
        //     return user;
        // } else {
        //     return null;
        // }
        // })
      let res = await bcrypt.compare(password, user.password)
      if(res) {
        return user
      }
      return null
    }
}
