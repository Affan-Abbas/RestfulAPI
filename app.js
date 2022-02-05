//jshint esversion:6
const express= require("express");
const bodyParser= require("body-parser");
const ejs = require ("ejs");
const mongoose= require('mongoose');
const app= express();
app.set('view engine', ejs);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/Wikipedia",{useNewUrlParser:true});
const articleSchema={
    title:String,
    content:String
};
const Article= mongoose.model("Article",articleSchema);
////////////////////////Targeting All data////////////////
app.route("/articles").get(function(req,res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);}
        else{
            res.send(err);
        }});     
})

.post(function(req,res){
   console.log(req.body.title);
    console.log(req.body.content);
    const newArticle=new Article({
        title:req.body.title,
        content: req.body.content
    });
    newArticle.save((err)=>{
        if(!err){
            res.send("Success");
        }else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
Article.deleteMany((err)=>{
if(!err){
    res.send("Successfully deleted!");
}else{
    res.send(err);
}
});
});
////////////////////////Targeting Specific data////////////////
app.route("/articles/:articleTitle")
.get((req,res)=>{
Article.findOne({title: req.params.articleTitle},(err,foundArticle)=>{
    if(foundArticle){
res.send(foundArticle);
    }else{
        res.send("No Articles found");
    }
});
})
.put((req,res)=>{
Article.updateOne(
{title: req.params.articleTitle},
{title: req.body.title,
content: req.body.content},
(err)=>{
    if(!err){
        res.send("Successfully Updated");
    }else{
        res.send("Request Failed");
    }
}
);
})
.patch((req,res)=>{
Article.updateOne(
{title: req.params.articleTitle},
{$set: req.body},
(err)=>{
    if(!err){
        res.send("Successfully Updated");
    }else{
        res.send("Request Failed");
    }
}
);
})
.delete((req,res)=>{
Article.deleteOne(
{title: req.params.articleTitle},
{title: req.body.title,
content: req.body.content},
(err)=>{
    if(!err){
        res.send("Successfully Updated");
    }else{
        res.send("Request Failed");
    }
}
);
});
app.listen(3000, function(){console.log("Server started");});