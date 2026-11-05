import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authroutes.js'
import todoRoutes from './routes/todoroutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.port || 5001

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))

//login page api
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

//auth routes
app.use('/auth', authRoutes)

//todo routes
app.use('/todos', authMiddleware,todoRoutes)


app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
})
