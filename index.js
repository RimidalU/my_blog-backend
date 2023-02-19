import express from 'express'
import jwt from 'jsonwebtoken'

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
    }, '#CryptoKey123')

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

app.listen(4000, (err) => {
  if (err) {
    return console.log({ err })
  }
  console.log('server start on port 4000')
})
