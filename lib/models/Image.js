const exiftool = require("exiftool-vendored").exiftool;
// const exifr = require("exifr")
const mongoose = require("mongoose")

const ImageSchema = new mongoose.Schema({
  name: String,
  path: {
    type: String,
    required: true
  },
  metadata: Object
},{
  collection: "images"
})

ImageSchema.pre("save", async function (next) {
  const image = this;
  // console.log(image)
  const tags = await exiftool.read(image.path)

  image.metadata = tags;
  // exiftool.end();
  return next();
})

module.exports = mongoose.models?.Image || mongoose.model("Image", ImageSchema)
