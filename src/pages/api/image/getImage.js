import Image from "lib/models/Image"
import dbConnect from "lib/mongoose"

export default async function handler(req, res) {
  let images = await getImageData(req.body.imageId)

  return res.status(200).json(images)
}


export async function getImageData(imageId) {
  await dbConnect();

  let images;
  // console.log("HEHEAERSAIRESI")
  if(!imageId){
    images = await Image.find({});
  } else {
    images = await Image.findOne({_id: imageId})
    // console.log(images)
  }
  return images
}
