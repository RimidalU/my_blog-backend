import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello, My Blog!')
})

app.listen(4000, (err) => {
  if(err) {
    return console.log({ err })
  }
  console.log('server start on port 4000')
})
