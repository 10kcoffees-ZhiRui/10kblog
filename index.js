var express = require('express');
var app = express();
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/db');

//var db = mongoose.connection;


var blogModel = mongoose.model('Blog', {
    blogName: String,
    entries: [{
        id: Number,
        title: String,
        date: Date,
        content: String,
        image: String
    }]
});


app.listen(8080);
console.log("App listening on port 8080");

app.get('/', function(req, res) {
    //res.send('Welcome to my world... (BLOG)');

    blogModel.find(function(err, entries) {
        if (err) {
            res.send(err);
        }else {
            res.json(entries);
        }
    });
})