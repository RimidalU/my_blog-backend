import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.MONGODB_CONNECT_LINK)
.then(() => {console.log('MongoDB connect OK!')})
.catch((err) => {console.log(`MongoDB connect Error: ${err}`)})

const port = process.env.PORT_OF_SERVER | 3600

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, My Blog!')
})

app.post('/auth/login', (req, res) => {

  if (req.body.email === 'test@mail.yep') {
    const token = jwt.sign({
      email: req.body.mail,
      name: 'Test Name'
    }, process.env.JWT_CRYPTO_KEY)

    res.json({
      success: true,
      token
    })
  } else {
    res.json({
      success: false,
    })
  }
})

app.listen(port , (err) => {
  if (err) {
    return console.log({ err })
  }
  console.log(`Server start on port ${port}`)
})
