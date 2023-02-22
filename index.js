import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import fs from 'fs'
import * as dotenv from 'dotenv'

import { registerValidation, loginValidation, postCreateValidation } from './validations/index.js'
import { UserController, PostController } from './controllers/index.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'

dotenv.config()

mongoose.connect(process.env.MONGODB_CONNECT_LINK)
  .then(() => { console.log('MongoDB connect OK!') })
  .catch((err) => { console.log(`MongoDB connect Error: ${err}`) })

const port = process.env.PORT || 3600

const app = express()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('uploads'))


app.get('/', (req, res) => {
  res.send('Hello, My Blog!')
})

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', checkAuth, PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.status(200).json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.listen(port, (err) => {
  if (err) {
    return console.log({ err })
  }
  console.log(`Server start on port ${port}`)
})
