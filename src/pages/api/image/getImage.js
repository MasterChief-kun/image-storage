import Image from "lib/models/Image"
import dbConnect from "lib/mongoose"

export default async function handler(req, res) {
  await dbConnect();

  let images = await Image.find({})
  return res.status(200).json(images)
}
