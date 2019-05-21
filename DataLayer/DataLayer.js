var MongoDB = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://bastien:kdlQFe58BjviyjV9@cluster0-cctqy.gcp.mongodb.net/test?retryWrites=true";
var client = new MongoClient(uri, {
    useNewUrlParser: true
})
var db;

var dataLayer = {
    
    init : function(callback){
        client.connect(function(err) {
            if(err) throw err;

            db = client.db("sightstudy");
            callback();
        });
    },
	
    // Permet de récupérer la liste des utilisateurs
    getUserSet : function(user, callback){
        var query = {};
        db.collection("User").find().toArray(function(err, list_user) {
            if(err) throw err;
            
            callback(list_user);
        });
    },
	
	// Créé un utilisateur
    createUser : function(user, callback){
        user.tests = [];
        db.collection("User").insertOne(user, function(err,result){
            if(err) throw err;

            callback();
        });
    },

    // Permet de trouver un utilisateur
    findUser : function(user,callback){
        var query = { username: user.username};
        db.collection("User").findOne(query, function(err, result){   
            if(err) throw err;
            
            callback(result);

        });
    }
};

module.exports = dataLayer;