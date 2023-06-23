const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    // required: true,
  },
  number: {
    type: String,
    minLength: [9, 'Must be at least 8 numbers with 1 dash ("-")'],
    validate: [
      {
        validator: function (v) {
          return /\d{3}-\d{5}/.test(v) || /\d{2}-\d{6}/.test(v)
        },
        message:
          'Only number and number format should be 123-45678... or 12-345678...',
      },
    ],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
