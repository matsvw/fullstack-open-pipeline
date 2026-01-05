const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 3,
    required: true
  },
  author: {
    type: String,
    minLength: 3,
    required: true
  },
  url: {
    type: String,
    validate: {
      validator: function (v) {
        return /(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/.test(v)
      },
      message: props => `${props.value} is not a valid URL!`
    },
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [
    {
      comment: { type: String, required: true },
    }
  ],
  // This does not really many sense for a blog list, but the implementation is only for testing this feature
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)