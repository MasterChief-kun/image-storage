import User from "lib/models/User";
import dbConnect from "lib/mongoose";

export default async function handler (req, res) {
  await dbConnect();
  let userDat = req.body;

  let newUser = await User.create({
    username: userDat.username,
    password: userDat.password,
    images: [],
    likes: []
  })

  return res.status(200).json(newUser)
}
