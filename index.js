import express from 'express'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, My Blog!')
})

app.post('/auth/login', (req, res) => {
  console.log(req.body);
  res.json({
    success: true,
  })
})

app.listen(4000, (err) => {
  if (err) {
    return console.log({ err })
  }
  console.log('server start on port 4000')
})
