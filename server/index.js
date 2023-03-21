// console.log('hello world')

var express = require('express');
var app = express();

app.get('/nilu', function(req, res){
    res.send("I am available here");

})

app.post('/nilu', function(req, res){
    res.send("I am available in post also");

})

var server = app.listen(8080)
console.log("First node project done succesfully")

