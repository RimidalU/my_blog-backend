import express from 'express'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'

import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'

import { registerValidation, loginValidation } from './validations/auth.js'
import { postCreateValidation } from './validations/post.js'

import checkAuth from './utils/checkAuth.js'
dotenv.config()

mongoose.connect(process.env.MONGODB_CONNECT_LINK)
  .then(() => { console.log('MongoDB connect OK!') })
  .catch((err) => { console.log(`MongoDB connect Error: ${err}`) })

const port = process.env.PORT_OF_SERVER || 3600

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, My Blog!')
})

app.post('/auth/register', registerValidation, UserController.register)
app.post('/auth/login', loginValidation, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

// app.get('/posts', PostController.getAll)
// app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
// app.delete('/posts', PostController.remove)
// app.patch('/posts', PostController.update)


app.listen(port, (err) => {
  if (err) {
    return console.log({ err })
  }
  console.log(`Server start on port ${port}`)
})
