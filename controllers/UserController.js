import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'

import UserModel from '../models/User.js'

export const register = async (req, res) => {
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
}

export const login = async (req, res) => {
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
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User is not found.'
      })
    }

    const { passwordHash, __v, ...userData } = user._doc
    res.status(200).json({
      success: true,
      ...userData
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Access denied!`,
      error
    })
  }
}
