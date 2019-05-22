// Importation de dataLayer
var dataLayer = require('./dataLayer/dataLayer');

// Importation des modules importants.
var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
//const bcrypt = require('bcrypt');
var jwtUtils = require('./utils/jwt.utils.js');
var cookie = require('cookie');

// Sel pour bcrypt
//const saltRounds = 10;

// PORT dynamique pour heroku ou localhost
const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// Pour l'application mobile
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-with, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Créé un utilisateur suite à son inscription
app.post("/createUser", function(req, res){
    if(req.body && typeof req.body.username != 'undefined'){
        var user = {
            username : req.body.username,
        };  

        var userCheck;
        dataLayer.findUser(user,function(dtSet){
            userCheck = dtSet;

            // Un pseudonyme est unique, donc on vérifie si il n'est pas déjà utilisé
            if(userCheck != null && userCheck.username == user.username){
                res.send({
                    success: false,
                    error: user.username + " existe déjà."
                });
            } else {
                console.log(user);

                dataLayer.createUser(user, function(){
                    res.send({
                        success: true,
                        error: "Votre profil a bien été créé."
                    });
                });
            }
        });

    } else {
            res.send({
                success : false,
                error : "Nom d'utilisateur invalide."
            });
    }
});

// Connexion d'un utilisateur
app.post("/loginUser", function(req, res){
    if(req.body && typeof req.body.username != 'undefined'){
        user = req.body;
        dataLayer.findUser(user,function(dtSet){
            userCheck = dtSet;
            if(userCheck != null && userCheck.username == user.username){
				res.send({
					success: true,
					_id: userCheck._id,
					username: userCheck.username,
					token: jwtUtils.generateTokenForUser(userCheck)
				});
            } else {
                res.send({
                    success: false,
                    error: "Nom d'utilisateur invalide."
                })
            }
        });
    } else {
        res.send({
            success: false,
            error: "Nom d'utilisateur invalide."
        });
    }
});

// Renvoie les utilisateurs
app.get("/getUserSet", function(req, res){
    dataLayer.getUserSet(function(response){
        res.send(response);
    });
});

dataLayer.init(function(){
    app.listen(PORT);
    console.log("App listening on port " + PORT);
});

dataLayer.init(function(){
});

