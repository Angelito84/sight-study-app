// Imports
var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'ns742ycab9e8qrmn7gpz6kr2hy7g4tw9e46v7stea35wrkscfhq5s7b2yufm';

module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
            _id: userData._id,
            username: userData.username
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    },

    generateTokenForpassword: function(password) {
        return jwt.sign({
            password: password
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    },

    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },

    getUserId: function(authorization) {
        var _id = -1;
        var token = authorization;

        if(token != null) {
            try {
                // On verifie que le Token est valide
                var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if(jwtToken != null) {
                    _id = jwtToken._id;
                }
            } catch(err) {}
        }
        return _id;
    },

    getUserName: function(authorization) {
        var username = undefined;
        var token = authorization;

        if(token != null) {
            try {
                // On verifie que le Token est valide
                var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if(jwtToken != null) {
                    username = jwtToken.username;
                }
            } catch(err) {}
        }
        return username;
    }
};