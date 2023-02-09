import { ObjectId } from "mongodb"
import multer from "multer"
import { unstable_getServerSession } from "next-auth"
import nextConnect from "next-connect"
import { authOptions } from "../auth/[...nextauth]"
import * as fs from "fs"
import Image from "lib/models/Image"
import dbConnect from "lib/mongoose"

const imageId = new ObjectId()

const upload = multer({
  storage: multer.diskStorage({
    destination: process.env.FILE_PATH,
    filename: (req, file, cb) => cb(null, `${imageId}_${file.originalname}`)
  })
})
const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res.status(400).json({ message: "Invalid method" })
  }
})
apiRoute.use(upload.array("images"))


apiRoute.post(async (req, res) => {
  await dbConnect()
  let session = await unstable_getServerSession(req, res, authOptions)
  if(session){
    // console.log(req.files)
    req.files.forEach((file) => {
      Image.create({
        name: file.originalname,
        path: file.path
      })
    })
    res.status(200).json({ message: "Done!" })
  } else {
    req.files.forEach((file) => {
      fs.rm(file.path)
    })
    res.status(401).json({ message: "Unauthorized" })
  }
})

export default apiRoute;

export const config = {
  api: {
    bodyParser: false
  }
}
