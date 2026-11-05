import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'


const router = express()

//auth routes

//sign up route
router.post('/register', (req, res) => {
    const {username, password} = req.body
    const hashedPassword = bcrypt.hashSync(password, 8)

    try{
        const insertUser = db.prepare(`
            INSERT into users(username, password)
            VALUES(?, ?)
            `
        )
        console.log("Hashing pwd now")
        const result = insertUser.run(username, hashedPassword)

        const defaultTodo = 'Hello :D Add your first todo!'
        const insertTodo = db.prepare(`
                INSERT into todos(user_id, tasks)
                VALUES(?, ?)
            `)
        insertTodo.run(result.lastInsertRowid, defaultTodo)
        console.log('Inserted default todo')

        //create a token 
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_KEY, {
            expiresIn: '24h',
        })
        res.json({ token })

    }catch(err){
        console.log(err.message)
        res.sendStatus(503)
    }

})

//login route
router.post('/login', (req, res) => {
    res.sendStatus(200)
})

export default router
