import { body } from 'express-validator'

export const registerValidation = [
  body('email', 'Incorrect Email format').isEmail(),
  body('password', 'Password must be at least 5 characters in length').isLength({ min: 5 }),
  body('fullName', 'Insert full name').isLength({ min: 3 }),
  body('avatarUrl', 'Wrong avatar link').optional().isURL(),
]

export const loginValidation = [
  body('email', 'Incorrect Email format').isEmail(),
  body('password', 'Password must be at least 5 characters in length').isLength({ min: 5 }),
]
