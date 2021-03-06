const express = require('express'),
      bodyParser = require('body-parser'),
      bcrypt = require('bcrypt-nodejs'),
      cors = require('cors'),
      knex = require('knex'),
      register = require('./controllers/register'),
      signin = require('./controllers/signin'),
      profile = require('./controllers/profile'),
      image = require('./controllers/image')





const app = express(),
      db = knex({
        client: 'pg',
        connection: {
          connectionString: process.env.DATABASE_URL,
          ssl: true
        }
      })




app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => { res.send('it works') })  //getting root request

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})  //getting and responding to post request on /signin

app.post('/register', (req, res) => {

  const {email} = req.body
  //
  db.select('email')
    .from('login')
    .where('email', '=', email)
    .then(existing => {
      if(existing.length === 0) {
        register.handleRegister(req, res, db, bcrypt)
      } else {
        signin.handleSignin(req, res, db, bcrypt)
      }
    })

})  //getting and responding to post request on /register

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => {image.handleImagePut(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})




// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });




app.listen(process.env.PORT || 3000, () => {
  console.log(`app's server is live on port ${process.env.PORT}`)
})  //start server




/*
API Notes

  / --> res = this is working
  /signin --> POST = success/fail
  /register --> POST = user
  /profile/:userid --> GET = user
  /image --> PUT = user

*/
