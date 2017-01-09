var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/db');


app.listen(8080);
console.log("App listening on port 8080");