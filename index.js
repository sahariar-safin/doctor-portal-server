const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs-extra')
const app = express()
const port = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const FileUpload = require('express-fileupload');
require('dotenv').config()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('doctorImage'));
app.use(FileUpload());


const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.gopg3.mongodb.net/${ process.env.DB_NAME }?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookings = client.db(`${ process.env.DB_NAME }`).collection("booking");
    const doctors = client.db(`${ process.env.DB_NAME }`).collection("doctors");

    app.post('/booking', (req, res) => {
        bookings.insertOne(req.body)
            .then(response => {
                res.send(response);
            })
    })

    app.post('/appointment', (req, res) => {
        bookings.find({ appointmentDate: req.body.date })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/uploadDoctorImage', (req, res) => {
        const file = req.files.image;
        const newImg = file.data;

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(newImg).toString('base64')
        };

        res.send(image)
    })

    app.post('/addDoctor', (req, res) => {
        doctors.insertOne(req.body)
            .then(response => {
                res.send(response);
            })
    })

    app.get('/doctors', (req, res) => {
        doctors.find({})
            .toArray((err, document) => {
                res.send(document);
            })
    })
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${ port }`)
})