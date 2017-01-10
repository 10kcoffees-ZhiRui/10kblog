var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser =require('body-parser');


mongoose.connect('mongodb://localhost/db');

//var db = mongoose.connection;


var blogModel = mongoose.model('Blog', {
    id: Number,
    title: String,
    date: {type: Date, default: Date.now },
    content: String,
    image: String
});


app.listen(8080);
console.log("App listening on port 8080");

app.get('*', function(req, res) {
    res.sendFile('index.html', { root: '/Users/ttcdev/Documents/blog'});
});

app.use(bodyParser.urlencoded({ extended: true}));

app.get('/api', function(req, res) {
    //res.send('Welcome to my world... (BLOG)');

    blogModel.find(function(err, entries) {
        if (err) res.send(err);
        res.send(entries);
    });
});

app.post('/api', function(req, res, next) {
    blogModel.create({
        title : req.body.title,
        // add more stuff later
        },
        function (err, entry) {
            if (err) res.send(err);
            res.end();
        }
    );
    }
);