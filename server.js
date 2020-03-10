const express = require('express')
const app = express()
const bodyparser = require("body-parser");

// queries
const queries = require('./queries')

app.use(bodyparser.json());
app.use(express.urlencoded({ extended: false }))

// index
app.get('/', (req, res) => {
    res.json({ info: "Node.js, Express, and Postgres API" });
})

// user queries
app.get('/users', queries.getUsers)
app.get('/user/:id', queries.getUserById)
app.post('/users', queries.addUser)
app.put('/users/:id', queries.updateUser)
app.delete('/users/:id', queries.deleteUser)



app.listen(3000)