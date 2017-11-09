var express = require('express');
var app = express();
var parser = require('body-parser');
var mongoose = require('mongoose');

//Define Database Connection
var db = mongoose.connect('mongodb://localhost/techmedia');

//Import Schemas
var Users = require('./model/users');
var Posts = require('./model/posts');

//Using Middleware
app.use(parser.json());
app.use(parser.urlencoded({extended : false}));


app.post('/', function(req,res){
    var Post = new Posts(req.body);
    /* Long Declaration
    Post.title = req.body.title;
    Post.topic = req.body.topic;
    Post.tag = req.body.tag;
    Post.people = req.body.people;

    Post.content.file = req.body.content.files;
    Post.content.image = req.body.content.image;
    Post.content.videos= req.body.content.videos;
    Post.content.text = req.body.content.text;
    */
    Post.save(function(err, save){
        if (err){
            res.status(500).send({error : "Couldn't upload post to database"});
        }
        else {
            res.status(200).send(save);
        }
    })
});

app.get('/', function(req,res){

   	 Posts.find({}, function(err, data){
         if(err){
             res.status(500).send({error:"Could not get data, an error occured"});
         }else{
             res.status(200).send(data);
         }
     });
});

app.delete('/posts/delete:objid', function(req,res){
    var urlParam = req.params.objid;
    Posts.find({ id : urlParam }).remove(function(err, succ){
        if(err){
            res.status(500).send({error:"An error occured, cannot delete post"});
        }else{
            res.status(200).send(succ);
        }
    }).exec()
});

app.listen(3000,function(){
   console.log("Hello!"); 
});