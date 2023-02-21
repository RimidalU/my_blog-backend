import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
import { validationResult } from 'express-validator'

import UserModel from './models/User.js'
import { registerValidation } from './validations/auth.js'

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

app.post('/auth/register', registerValidation, async (req, res) => {

  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }

    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const newUserData = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash
    })

    const user = await newUserData.save()
    const { passwordHash, __v, ...userData } = user._doc

    const token = jwt.sign({
      _id: user._id,
    },
      process.env.JWT_CRYPTO_KEY,
      {
        expiresIn: '1d',
      }
    )

    res.status(200).json({
      success: true,
      ...userData,
      token
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to register user.`,
      error
    })
  }
})

app.post('/auth/login', async (req, res) => {
  try {

    const user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).json({
        message: `Failed to login user. Wrong login or password.`,
      })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
    if (!isValidPass) {
      return res.status(404).json({
        message: `Failed to login user. Wrong login or password.`
      })
    }

    const { passwordHash, __v, ...userData } = user._doc

    const token = jwt.sign({
      _id: user._id,
    },
      process.env.JWT_CRYPTO_KEY,
      {
        expiresIn: '1d',
      }
    )

    res.status(200).json({
      success: true,
      ...userData,
      token
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to login user.`,
      error
    })
  }
})

app.listen(port, (err) => {
  if (err) {
    return console.log({ err })
  }
  console.log(`Server start on port ${port}`)
})
