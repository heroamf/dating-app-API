var mongoose = require("mongoose"),
  slug = require("slug"),
  uniqueValidator = require("mongoose-unique-validator"),
  User = mongoose.model("User");

var ImageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      lowercase: true,
      unique: true
    },
    title: String,
    description: String,
    url: String,
    favoritesCount: {
      type: Number,
      default: 0
    },
    tagList: [{ type: String }],
    whoPosted: { type: mongoose.Schema.Types.ObjectID, ref: "User" }
  },
  { timestamps: true }
);

ImageSchema.plugin(uniqueValidator, {
  message: "está em uso."
});

ImageSchema.pre("validate", function (next) {
  if (!this.slug) {
    this.slugify();
  }
});

ImageSchema.methods.slugify = () => {
  this.slug =
    slug(this.title) +
    "-" +
    ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
};

ImageSchema.methods.updateFavoriteCount = () => {
  var image = this;

  return User.count({
    favorites: {
      $in: [image._id]
    }
  }).then((count) => {
    image.favoritesCount = count;
    return image.save();
  });
};

ImageSchema.methods.toJSONfor = (user) => {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    url: this.url,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    whoPosted: this.whoPosted.toProfileJSONFor(user)
  };
};

mongoose.model("Image", ImageSchema);
