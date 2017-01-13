var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');


mongoose.connect('mongodb://localhost/db');

//var db = mongoose.connection;


var blogModel = mongoose.model('Blog', {
    name: String,
    posts: [{
        id: Number,
        title: String,
        date: {type: Date, default: Date.now},
        content: String,
        image: String
    }]}
);

var userModel = mongoose.model('User', {
    email: String,
    password: String
});


app.listen(8080);
console.log("App listening on port 8080");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.get('/api/:blogModel_id', function(req, res) {

    blogModel.findById({
        _id: req.params.blogModel_id
    }, 'posts', function(err, entries) {
            if (err) res.send(err);
            res.json(entries);
    });
});

app.get('/api/switchBlog/:blogModel_id', function(req, res) {

    console.log(req);

    blogModel.findById({
        _id: req.params.blogModel_id
    }, 'name posts', function(err, blog) {
        if (err) res.send(err);
        console.log(blog);
        res.json(blog);
    });
});

app.get('/api', function(req, res) {
    blogModel.find(
        {}, '_id name', function(err, blogs) {
            if (err) res.send(err);
            res.json(blogs);
        }
    );
});

app.post('/api/createBlog', function(req, res) {
    console.log(req.body);
    blogModel.create(req.body,
        function (err, blog) {
            if (err) res.send(err);

            blogModel.findById({
                _id: blog._id
            }, 'name posts', function(err, blog) {
                if (err) res.send(err);
                res.json(blog);
            });
        }
    );
});

app.post('/api/:blogModel_id', function(req, res, next) {
    console.log(req.body);
    console.log(req.params.blogModel_id);
    blogModel.update({
        _id: req.params.blogModel_id
    },  {
        $addToSet: { posts: req.body}
    }, function (err, entry) {
            if (err) res.send(err);

            blogModel.findById({
                _id: req.params.blogModel_id
            }, 'posts', function(err, blog) {
                if (err) res.send(err);
                res.json(blog.posts);
            });
        }
    );
    }
);

function createJWT(user) {
    var payload = {
        sub: user._id,
    };
    return jwt.encode(payload, "secret");
}

app.post('/auth/signup', function(req, res) {
    console.log(req.body.email);
    userModel.findOne({ email: req.body.email}, function (err, existingUser) {

        if (existingUser) {
            console.error('User exists already!');
            res.status(409);
            res.send({ message: 'Email is already taken'});
            return;
        }

        userModel.create(req.body,
            function (err, user) {
                if (err) {
                    console.error('Error saving the user!');
                    res.status(500).send({ message: err.message });
                }
                res.send({ token: createJWT(user) });
        })
    })
})



app.delete('/api/:blogModel_id/:entry_id', function(req, res) {
    console.log(req.params);
    blogModel.update({
        _id : req.params.blogModel_id
    }, {
        $pull: {posts: {_id: req.params.entry_id}}
    }, function (err, entry) {
            if (err) res.send(err);

            blogModel.findById({
                _id: req.params.blogModel_id
            }, 'posts', function(err, blog) {
                if (err) res.send(err);
                res.json(blog.posts);
            });
        }
    );
    }
);


app.get('*', function(req, res) {
    res.sendFile('./public/index.html', { root: '/Users/ttcdev/Documents/blog'});
});