const handleRegister = (req, res, db, bcrypt) => {
  const {name, email, password} = req.body

  if(!name || !email || !password) {
    return res.status(400).json('Incorrect form submission')
  }
  let hash = bcrypt.hashSync(password)

  db.transaction(trx => {
    trx.insert({
      hash,
      email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          name,
          email: loginEmail[0],
          joined: new Date()
        })
        .then(user => {
          res.json(user[0])
        })
        .catch(err => {
          res.status(400).json('try again')
        }, trx.rollback)
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
}

module.exports = {
  handleRegister
}
