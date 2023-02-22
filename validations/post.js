import { body } from 'express-validator'

export const postCreateValidation = [
  body('title', 'Enter the title of the article').isLength({ min: 3 }).isString(),
  body('text', 'Enter the text of the article').isLength({ min: 5 }).isString(),
  body('tags', 'Invalid tag format (specify array)').optional().isArray(),
  body('imageUrl', 'Wrong image link').optional().isString(),
]
