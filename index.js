const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose')
const User = require('./models/user')
const Exercise = require('./models/exercise.js')


mongoose.connect(process.env.MONGO_STRING, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})


app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users', (req, res) => {
  const newUser = new User({
    username: req.body.username
  })
  newUser.save((err, data) => {
    if (err) {
      res.send(err)
    } else {
      res.json({ username: req.body.username, _id: data.id })
    }
  })
})

app.post('/api/users/:id/exercises', (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      res.send(err)
    } else {
      const id = req.params.id
      const description = req.body.description
      const duration = req.body.duration
      let date = new Date().toDateString()
      if (req.body.date) {
        date = new Date(req.body.date);
      }
      // const date = new Date(req.body.date)
      const newExercise = new Exercise({
        userId: id,
        description: description,
        duration: duration,
        date: date
      })
      newExercise.save((err) => {
        if (err) {
          res.send(err)
        } else {
          res.json({
            _id: data.id,
            username: data.username,
            date: req.body.date? new Date(req.body.date).toDateString() : new Date().toDateString(),
            duration: Number(duration),
            description: description,
          })
        }
      })

    }
  })
})


app.get('/api/users', async (req, res) => {
  const allUsers = await User.find({})
  res.send(Array.from(allUsers))
})

app.get('/api/users/:id/logs', (req, res) => {
  const id = req.params.id
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.send(err)
    } else {
      let obj = { 'userId': id }
      const to = req.query.to
      const from = req.query.from
      if (to) {
        obj['$lte'] = new Date(to)
      }
      if (from) {
        obj['$gte'] = new Date(from)
      }
      let limit = 100
      if (req.query.limit != null) {
        limit = req.query.limit
      }
      Exercise.find(obj).limit(Number(limit)).exec((err, data) => {
        if (err) {
          res.json(err)
        } else {
          const username = user.username
          const id = user.id
          const log = data.map(x => {
            return {
              description: x.description,
              duration: x.duration,
              date: x.date.toDateString()
            }
          })
          res.json({
            _id : id,
            username,
            count: data.length,
            log
          })
        }
      })
    }
  })
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
