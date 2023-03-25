// console.log('hello world')

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const openDB = require("./db.utils").openDB;
const setupDB = require("./db.utils").setupDB;
const closeDB = require("./db.utils").closeDB;

const db = openDB();
setupDB(db);





//check users table, if userId and password combination exists in table
//If exists then generate random token.
//store token into the users table
//return the token in response.
app.post("/authenticate", function (req, res) {
    if (!req.body || !req.body.userId || !req.body.password) {
        res.status(401).send("Unauthorized");
    } else {

        const checkUser = require("./db.utils").checkUser;
        checkUser(req.body.userId, req.body.password, db).then((token) => {
            res.send(token).status(200);        
        }).catch(err=>{
            console.log(err);
            res.status(401).send(err);
        })

    }
})


var server = app.listen(8080)
console.log("First node project done succesfully")

