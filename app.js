// Importation de dataLayer
var dataLayer = require('DataLayer/dataLayer');

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
                    error: "L'utilisateur " + user.username + " existe déjà."
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
app.get("/getUsers", function(req, res){
    dataLayer.getUsers(function(response){
        res.send(response);
    });
});

// Ajoute un test à une liste de test de l'utilisateur
app.post("/savetest", function(req, res){
    if(req.body && typeof req.body.user != 'undefined'){
        var user = req.body.user;
        var event = new Date();
        var options = { year: 'numeric', month: 'numeric', day: 'numeric' , hour: "numeric" , minute: "numeric" };
        var testData = {
            date: event.toLocaleDateString('fr-FR', options),
           etdrs_d: req.body.etdrs_d,
            av_d: req.body.av_d,
            etdrs_g: req.body.etdrs_g,
            av_g: req.body.av_g
        };
        dataLayer.createTest(user, testData, function(){
            res.send({
                success: true
            });
        });

    } else {
        res.send({
            success : false,
            error : 'Un ou plusieurs arguments invalides.'
        });
    }
});

// Renvoie les tests
app.get("/getTests", function(req, res){
    var username = undefined;
    // Vérifie si l'utilisateur est connecté
    if(req.headers.cookie === undefined){
        // Si il n'y a aucun cookie, on utilise le header 'Authorization' dans lequel sera rentré le token généré durant la connexion
        username = jwtUtils.getUserName(req.headers.authorization);
    } else {        
        // Sinon, on parse le cookie pour récupérer le token et vérifier sa validité
        var cookies = req.headers.cookie;
        cookies = cookie.parse(cookies);
        cookies = JSON.parse(cookies.user);
        username = jwtUtils.getUserName(cookies.token);
    }

    // Si l'utilisateur n'est pas connecté ou que le token est invalide, on lui demande de se conneceter
    if(username == undefined){
        res.send({
            success: false,
            error: "Vous devez vous connecter."
        });
    } else {
        var user = {
            username: username
        }
        dataLayer.findUser(user, function(response){
            res.send(response);
        });
    }
});


dataLayer.init(function(){
    app.listen(PORT);
    console.log("App listening on port " + PORT);
});

dataLayer.init(function(){
});

