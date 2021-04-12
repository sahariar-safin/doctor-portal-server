const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.gopg3.mongodb.net/${ process.env.DB_NAME }?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookings = client.db(`${ process.env.DB_NAME }`).collection("booking");

    console.log(err);
    app.post('/booking', (req, res) => {
        bookings.insertOne(req.body)
            .then(response => {
                console.log(response);
                res.send(response);
            })
    })
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${ port }`)
})