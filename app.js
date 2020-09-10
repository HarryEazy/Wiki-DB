//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

// create DB & connect to it
mongoose.connect("mongodb://localhost:27017/WikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// create schema
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

// create mongoose model/collection based on the schema
const Article = new mongoose.model("Article", articleSchema);



//////////////////// Request targeting a specific article /////////////////////
app.route('/articles/:articleTitle')

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);

    } else {
      res.send('No article by that name');

    }
  });
})

.put(function(req, res){
  Article.update(
    // search database for specific entry
    {title: req.params.articleTitle},
    // update entry to what user specified
    {title: req.body.title, content: req.body.content},
    // overwrite set as true
     {overwrite: true},
     function(err){
       if(!err){
         res.send('Updated article');
       } else {
         res.send(err);
       }
     });
})


.patch(function(req, res){
  // call update function but dont use overwrite
  // $set - use the body which is a js object as the fields
  // we want to update so user can specify what they want to update
  Article.update(
    {title: req.params.articleTitle},
    { $set: req.body},
    function(err){
      if(!err){
        res.send('Successfully updated article');
      } else {
        rs.send(err);
      }
    }
  );
})


.delete(function(req, res){

  Article.deleteOne({title: req.params.articleTitle}, function(err){
    if(!err){
      res.send('Successfully deleted the article');
    } else {
      res.send(err);
    }
  });

});

////////////////////////////////////////////////////////////////////////////////


/////////////////////////// Request targetting all articles ////////////////////

// app.route allows to chain multipe function that trigger
// with the same route
app.route('/articles')

.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
        res.send(foundArticles);
    } else {
      res.send(err);
    }

  });
})

.post(function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  // check if save to db was successfull
  newArticle.save(function(err){
    if(!err){
      res.send('Successfully added article');
    } else {
      res.send(err);
    }
  });


})
.delete(function(req, res){
  // deleteMany has 2 params
  // first specified by {} is the entries we want to delete
  // filters the deletes by the argument
  // second is cb function
  // this deletes all entries in database as no first argument specified
  Article.deleteMany(function(err){
    if(!err){
      res.send('Successfully deleted all articles');
    } else {
      res.send(err);
    }
  });

});
///////////////////////////////////////////////////////////////////////////////

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
