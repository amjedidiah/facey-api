const Clarifai = require('clarifai'),
      app = new Clarifai.App({
       apiKey: '8a70c1bb14084765b87c867e5497d6e0'
      }),
      handleApiCall = (req, res) => {
       app.models
         .predict(
           Clarifai.FACE_DETECT_MODEL,
           req.body.input
         )
         .then(data => {
           res.json(data)
         })
         .catch(err => {
           res.status(400).json('Unable to work with the api')
         })
      },
      handleImagePut = (req, res, db) => {
        const {id} = req.body

        db('users').where('id', '=', id)
          .increment('entries', 1)
          .returning('entries')
          .then(data => {
            res.json(data)
          })
          .catch(err => {
            res.status(404).json('Unable to get entries')
          })
        }

module.exports = {
  handleImagePut,
  handleApiCall
}
