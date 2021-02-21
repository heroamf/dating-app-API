var mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator"),
  jwt = require("jsonwebtoken"),
  secret = require("../config").secret;

var UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Não pode estar em branco"],
      match: [/^[a-zA-Z0-9]+$/, "é inválido"],
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Não pode estar em branco"],
      match: [/^[a-zA-Z0-9]+$/, "é inválido"],
      index: true
    },

    bio: String,
    image: String,
    usersLiked: [{ type: mongoose.Schema.Types.ObjectID, ref: "User" }],
    imagesLiked: [{ type: mongoose.Schema.Types.ObjectID, ref: "Image" }]
  },
  { timestamps: true }
);

// #####################################################################################
// #################################### PLUGINS ########################################
// #####################################################################################

UserSchema.plugin(uniqueValidator, {
  message: "está em uso."
});

// #####################################################################################
// #################################### MÉTODOS ########################################
// #####################################################################################

UserSchema.methods.geraJWT = () => {
  var hoje = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  );
};

UserSchema.methods.toAuthJSON = () => {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image
  };
};

UserSchema.methods.toProfileJSONFor = (user) => {
  return {
    username: this.username,
    bio: this.bio,
    image:
      this.image || "https://static.productionready.io/images/smiley-cyrus.jpg",
    following: user ? user.isFollowing(this._id) : false
  };
};

UserSchema.methods.likeUser = (id) => {
  if (this.usersLiked.indexOf(id) === -1) {
    this.usersLiked.push(id);
  }
  return this.save();
};

UserSchema.methods.unlikeUser = (id) => {
  this.usersLiked.remove(id);
  return this.save();
};

UserSchema.methods.isUserLiked = (id) => {
  return this.usersLiked.some((userId) => {
    return userId.toString() === id.toString();
  });
};

UserSchema.methods.likeImage = (id) => {
  if (this.imagesLiked.indexOf(id) === -1) {
    this.imagesLiked.push(id);
  }
  return this.save();
};

UserSchema.methods.unlikeImage = (id) => {
  this.imagesLiked.remove(id);
  return this.save();
};

UserSchema.methods.isImageLiked = (id) => {
  return this.imagesLiked.some((imageId) => {
    return imageId.toString() === id.toString();
  });
};

mongoose.model("User", UserSchema);
