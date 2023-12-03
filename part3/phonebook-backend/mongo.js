const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}
if (process.argv.length === 4) {
    console.log('give name and number as arguments')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://lluisbrosa99:${password}@cluster0.t3asjqd.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    // Retrieve all people
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
} else {
    // Add person
    const personName = process.argv[3]
    const personNumber = process.argv[4]

    const person = new Person({
        name: personName,
        number: personNumber,
    })

    person.save().then(result => {
        console.log(`added ${personName} ${personNumber} to phonebook`)
        console.log(result)
        mongoose.connection.close()
    })
}
