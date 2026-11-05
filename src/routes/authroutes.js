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
                INSERT into todos(user_id, task)
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
    const {username, password} = req.body
    try{
        const getUser = db.prepare('SELECT * from users WHERE username = ?')
        const user = getUser.get(username)

        //if user is not found
        if(!user){
            return res.send({ "message": "User not found"})
        }

        const passwordMatches = bcrypt.compareSync(password, user.password)
        if(!passwordMatches){
            return res.status(401).send({message: "Incorrect password"})
        }
        //create a token 
        const token = jwt.sign({id: user.id}, process.env.JWT_KEY, {
            expiresIn: '24h',
        })
        res.json({ token })

    } catch {
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router
