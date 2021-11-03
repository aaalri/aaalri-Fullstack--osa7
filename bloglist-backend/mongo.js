const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

if (process.argv.length<3) {
  console.log('missing password')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://talkki:${password}@cluster0.gwldr.mongodb.net/puhelinluettelo-app?retryWrites=true&w=majority`

if (process.argv.length<4) {

  mongoose.connect(url)

  const Person = mongoose.model('Person', personSchema)

  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    process.exit(1)
  })

} else {
  const name = process.argv[3]
  const number = process.argv[4]


  mongoose.connect(url)

  const Person = mongoose.model('Person', personSchema)

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
    process.exit(1)
  })

}