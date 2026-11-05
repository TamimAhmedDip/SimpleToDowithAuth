import express from 'express'
import db from '../db.js'

const router = express()

//todo routes

//get todos
router.get('/', (req, res) => {
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?')
    const todos = getTodos.all(req.userId)
    res.json(todos)
})

//add a todo 
router.post('/', (req, res) => {
    const {task} = req.body
    const insertTodo = db.prepare('INSERT into todos(user_id, task) VALUES(?, ?)')
    const result = insertTodo.run(req.userId, task)

    res.json({id: req.userId, task, completed: 0})
})

//update a todo
router.put('/:id', (req, res) => {

})

//delete a todo 
router.delete('/:id', (req, res) => {

})

export default router