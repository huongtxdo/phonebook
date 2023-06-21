const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => console.log("connected to MongoDB"))
  .catch((error) => console.log("error connecting to MongoDB:", error.message));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// if (process.argv.length == 3) {
//   Person.find({}).then((persons) => {
//     console.log("phonebook:");
//     persons.forEach((person) => console.log(`${person.name} ${person.number}`));
//     mongoose.connection.close();
//   });
// } else if (process.argv.length == 5) {
//   const name = process.argv[3];
//   const number = process.argv[4];
//   const person = new Person({
//     name: name,
//     number: number,
//   });

//   person.save().then((result) => {
//     console.log(`added ${result.name} number ${result.number} to phonebook`);
//     mongoose.connection.close();
//   });
// }

module.exports = mongoose.model("Person", personSchema);
