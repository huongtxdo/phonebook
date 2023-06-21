const mongoose = require("mongoose");

if (process.argv.length < 3) {
  //   console.log("missing argument: node mongo.js <password> <name> <number>");
  console.log("missing arguments");
  process.exit(1);
}

const password = process.argv[2];
const appName = "personApp";

const url = `mongodb+srv://fullstack:${password}@cluster0.lugkxdq.mongodb.net/${appName}?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length == 3) {
  Person.find({}).then((persons) => {
    console.log("phonebook:");
    persons.forEach((person) => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
} else if (process.argv.length == 5) {
  const name = process.argv[3];
  const number = process.argv[4];
  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
