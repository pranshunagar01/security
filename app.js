//jshint esversion:6
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
const encrypt = require('mongoose-encryption');
const userSchema = mongoose.Schema({
    email: String,
    password: String
})


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const user = mongoose.model("user", userSchema);
const ejs = require('ejs');
const { use } = require('express/lib/application');
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("home");
});
app.get("/login", function(req, res){
    res.render("login");
});
app.get("/register", function(req, res){
    res.render("register");
});
app.post("/register", function(req, res){
    const newUser = new user({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    })
});
app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    user.findOne({"email": username}, function(err, foundUser){
        if(err){
            console.log(err)
        }
        else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    });
});
app.listen(3000, function(){
    console.log("The console has started successfully at 3000.")
});