const handleProfileGet = (req, res, db) => {
  const {id} = req.params

  db.select('*')
    .from('users')
    .where({id})
    .then(user => {
      user.length ? res.json(user[0]) : res.status(404).json('User not found')
    })
    .catch(err => {
      res.status(404).json('Error getting user')
    })
}

module.exports = {
  handleProfileGet
}
