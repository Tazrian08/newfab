/*
 * Module dependencies
 */
const express = require('express')
const cors = require('cors')
const query = require('./query');
const createCar = require('./createCar')
const changeOwner = require('./changeOwner')
const updateReputation = require('./updateReputation')
const updateType = require('./updateType')
const bodyParser = require('body-parser')
const changeCountry = require('./changeCountry')
const changeCount = require('./changeCount')
const updateCOF= require('./updateCOF')
const setCOF= require('./setCOF')

const app = express()

// To control CORSS-ORIGIN-RESOURCE-SHARING( CORS )
app.use(cors())
app.options('*', cors());

// To parse encoded data
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


// get all car
app.get('/get-car', function (req, res) {
    query.main( req.query )
    .then(result => {
        const parsedData = JSON.parse( result )
        let carList

        // if user search car
        if(  req.query.key && req.query.key.startsWith("C") && req.query.key.length==2){
            carList = [
                {
                    Key: req.query.key,
                    Record: {
                        ...parsedData
                    }
                },


            ]
            res.send( carList )
            return
        }

        carList = parsedData
        res.send( carList )
    })
    .catch(err => {
        console.error({ err })
        res.send('FAILED TO GET DATA!')
    })
})

// create a new car
app.post('/create', function (req, res) {
    createCar.main( req.body  )
    .then(result => {
        res.send({message: 'Created successfully'})
    })
    .catch(err => {
        console.error({ err })
        res.send('FAILED TO LOAD DATA!')
    })
})

app.post('/reputation', function (req, res) {
    updateReputation.main(req.body)
        .then(result => {
            res.send({ message: 'Updated successfully' })
        })
        .catch(err => {
            res.send({ message: "Error process failed"});
        });
});

app.post('/updateCOF', function (req, res) {
    updateCOF.main(req.body)
        .then(result => {
            res.send({ message: 'Updated successfully' })
        })
        .catch(err => {
            res.send({ message: "Error process failed"});
        });
});

app.post('/setCOF', function (req, res) {
    setCOF.main(req.body)
        .then(result => {
            res.send({ message: 'Updated successfully' })
        })
        .catch(err => {
            res.send({ message: "Error process failed" });
        });
});



// change car owner
app.post('/update', function (req, res) {
    changeOwner.main( req.body  )
    .then(result => {
        res.send({ message: 'Updated successfully' })
    })
    .catch(err => {
        res.send({ message: "Error process failed" });
    });
})
app.post('/updateType', function (req, res) {
    updateType.main( req.body  )
    .then(result => {
        res.send({message: 'Updated successfully'})
    })
    .catch(err => {
        console.error({ err })
        res.send('FAILED TO LOAD DATA!')
    })
})
app.post('/updateCountry', function (req, res) {
    changeCountry.main( req.body  )
    .then(result => {
        res.send({message: 'Updated successfully'})
    })
    .catch(err => {
        console.error({ err })
        res.send('FAILED TO LOAD DATA!')
    })
})
app.post('/updateCount', function (req, res) {
    changeCount.main( req.body  )
    .then(result => {
        res.send({message: 'Updated successfully'})
    })
    .catch(err => {
        console.error({ err })
        res.send('FAILED TO LOAD DATA!')
    })
})
app.listen(3000, () => console.log('Server is running at port 3000'))