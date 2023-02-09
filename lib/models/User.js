const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Image = require("./Image")

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  images: {
    type: Array,
    ref: Image
  },
  likes: [mongoose.Schema.Types.ObjectId]
},{
  collection: "users"
})

UserSchema.pre("save", function (next) {
  const user = this;
  // console.log(user)
  if(this.isModified("password") || this.isNew()) {
    bcrypt.genSalt(10, (saltError, salt) => {
      if(saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, (hashError, hash) => {
          if(hashError){
            return next(hashError);
          }

          user.password = hash;
          next();
        })
      }
    })
  } else {
    return next();
  }
})

module.exports = mongoose.models?.User || mongoose.model("User", UserSchema);
