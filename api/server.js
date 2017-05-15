const express = require("express");
const bodyParser= require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const Joi = require('joi');

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

    const schema = Joi.object().keys({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().length(2).required(),
        properties: Joi.object().keys({
            side: Joi.string().length(1).valid('F').valid('B').required(),
            user: Joi.string().guid().required(),
            cui: Joi.string().required()
        })
    });


    app.post('/data', (req, res) => {
        console.log(req.body);

        Joi.validate(req.body, schema, (error, result) => {
            if(error !== null){
                console.error(error);
                res.status(400).send(error);
            } else {
                if(req.get('token') === TOKEN){
                    db.collection('data').insertOne(req.body, (err, result) => {
                        if (err) return console.log(err);
                        res.send(result);
                    });
                } else {
                    res.status(400).send();
                }
            }
        });
    });
});