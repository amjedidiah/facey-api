const handleSignin = (req, res, db, bcrypt) => {
  const {email, password} = req.body

  if(!email || !password) {
    return res.status(400).json('Incorrect form submission')
  }

  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash)

      isValid ? (
         db.select('*')
                  .from('users')
                  .where('email', '=', email)
                  .then(user => {
                    res.json(user[0])
                  })
                  .catch(err => res.status(404).json('unable to get user'))
      ) : (
        res.status(404).json('incorrect password')
      )

    })
    .catch(err => res.status(404).json('wrong credentials'))
}


module.exports = {
  handleSignin
}
