const express = require ('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/myapp')
const Bear = require('./app/models/bears')
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())


let port = process.env.PORT || 8080

let router = express.Router()
//middleware
router.use(function(req, res, next) {
  console.log('Something is happening.')
  next()
})
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!'})
  })


// API ROUTES
router.route('/bears')
  .post(function(req, res) {
    let bear = new Bear()
    bear.name = req.body.name;

    bear.save(function(err) {
      if (err)
        res.send(err)

    res.json({message: 'Bear created!'})
    })
  })
router.route('/bears/:bear_id')
 //get the bear with that id
  .get(function(req, res) {
    Bear.find(function(err, bears) {
        if (err) res.send(err);

        res.json(bears);
    });
 })
//bears accessed at PUT
  .put(function(req, res) {
     Bear.findById(req.params.bear_id, function(err, bear) {
       if (err)
         res.send(err)
       bear.name = req.body.name

       bear.save(function(err) {
        if (err)
           res.send(err)
        res.json({message: 'Bear updated!'})
       })
     })
   })
  //delte id
   .delete(function(req, res) {
     Bear.remove({
       _id: req.params.bear_id
    }, function(err, bear) {
        if (err)
           res.send(err)

        res.json({ message: 'Successfully deleted' })

     })
   })

  app.use('/api', router)

  app.listen(port)
  console.log('Magic happens on port' + port)
