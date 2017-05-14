const express = require("express");
const bodyParser= require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const app = express();

const TOKEN = process.env.TOKEN || "superSecretTokenItIs!";
const ADMINTOKEN = process.env.ADMINTOKEN || "superSecretAdminTokenIsIt!";

app.use(bodyParser.urlencoded({extended: true}));

MongoClient.connect(process.env.MONGO || "mongodb://localhost:27017/editor", (err, database) => {
    if (err) return console.log(err);
    db = database;

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "token, Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.listen(process.env.PORT || 3000, function() {
        console.log('Server listening for requests.')
    });

    app.get('/data', function (req, res) {
        if(req.get('token') === ADMINTOKEN){
            db.collection('data').find({}).toArray((err, result) => {
                res.send(result);
            });
        } else {
            res.status(400).send();
        }
    });

    app.post('/data', (req, res) => {
        console.log(req);
        if(req.get('token') === TOKEN){
            db.collection('data').insertOne(req.body, (err, result) => {
                if (err) return console.log(err);
                res.send(result);
            });
        } else {
            res.status(400).send();
        }
    });
});