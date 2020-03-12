// GET— / | displayHome()
// GET— / users | getUsers()
// GET— / users /: id | getUserById()
// POST— users | createUser()
// PUT— / users /: id | updateUser()
// DELETE— / users /: id | deleteUser()

const Pool = require('pg').Pool

// DB config
const model = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'api',
    password: 'toor',
    port: 5432,
})


const getUsers = (req, res) => {
    model.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
        if (error) throw error
        res.status(200).json(results.rows)
    })
}

const addUser = (req, res) => {
    if (!req.body.subject || !req.body.email) {
        res.status(201).send(`User requires a Subject and Email`)
    } else {
        const { email, subject } = req.body
        model.query('INSERT INTO users (email, subject) VALUES ($1,$2) ', [email, subject],
            (error, result) => {
                if (error) throw error
                res.status(201).send(`User added with ID: ${result.insertId}`)
            }
        )
    }
}

const getUserById = (req, res) => {
    model.query('SELECT * FROM users WHERE user_id = $1', [parseInt(req.params.id)], (err, result) => {
        if (err) throw err
        if (result.rowCount == 0) {
            res.status(400).json({ msg: `No user found with the ID ${req.params.id}` })
        } else {
            res.status(200).json(result.rows)
        }
    })
}

const updateUser = (req, res) => {
    const id = parseInt(req.params.id)
    const { email, subject } = req.body
    model.query('UPDATE users set email=$1, subject=$2 WHERE user_id = $3', [email, subject, id], (err, result) => {
        if (err) throw err
        if (result.rowCount == 0) {
            res.status(400).json({
                msg: `No user found with the ID ${req.params.id}`
            })
        } else {
            res.status(200).send(`User modified with ID: ${id}`)
        }
    })
}

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id)
    model.query('DELETE FROM users WHERE user_id = $1', [id], (error, result) => {
        if (error) throw error
        if (result.rowCount == 0) {
            res.status(400).json({
                msg: `No user found with the ID ${req.params.id}`
            })
        } else {
            res.status(200).send(`User deleted with ID: ${id}`)
        }
    })
}

// Exports
module.exports = {
    getUsers,
    addUser,
    getUserById,
    updateUser,
    deleteUser
}