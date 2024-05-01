/*
    This function assumes that the request body contains a 
    JSON object which contains a property variable named as
    "token". It verifies this token and obtains a object from
    its payload (body part) which contains a "_id" property variable,
    this variable contains a string value that is converted to an
    ObjectId value and then this ObjectId value is used to find a
    matching user in the "note" database.

    If a matching user document is found in the "users" collection
    then the request token is searched for in this user document's
    "tokens" array, if the request token is found then the user gets
    authenticated, otherwise not.
*/
const clientPromise = require("../db-connectivity/mongo-client.js");
const jsonwebtoken = require("jsonwebtoken");
const jwtKey = require("../keys/jwt-key.js");
const mongodb = require("mongodb");

async function authenticate(req,res,next)
{
    const {token} = req.body;
    const mongoClient = await clientPromise;
    
    if(!token)
        return res.status(400).send({ error: "No request token was provided"  });

    try
    {
        const payload = jsonwebtoken.verify(token, jwtKey);
        let {_id} = payload;
        _id = new mongodb.ObjectId(_id);

        const user = await mongoClient.db("note").collection("users").findOne({ _id  });

        if(!user)
            return res.status(404).send({ error: "User not found"  });

        if(!user.tokens.includes(token))
            return res.status(400).send({ error: "Could not authenticate"  });

        req.user = user;
        req.token = token;

        next();
    }
    catch(error)
    {
        res.status(400).send({ error: "Token is either invalid or expired"  });
    }

}

module.exports = authenticate;