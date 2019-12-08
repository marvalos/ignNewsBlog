var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true,
    unique: true
  },
  // `teaser is not required and of type String
  teaser: {
    type: String,
    required: false
  },
  // `notes` is an array of objects that stores Note id's
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with a associated Notes
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ],
  saved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  modifiedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
