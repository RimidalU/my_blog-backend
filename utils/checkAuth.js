import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

export default (req, res, next) => {

  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_CRYPTO_KEY)
      req.userId = decodedToken._id
      next()
    } catch (error) {
      res.status(403).json({
        message: 'Access denied!'
      })
    }
  } else {
    res.status(403).json({
      message: 'Access denied!'
    })
  }
}
