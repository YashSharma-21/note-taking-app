const express = require("express");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const {Router} = express;
const userRouter = new Router();
const clientPromise = require("../db-connectivity/mongo-client.js");
const jwtKey = require("../keys/jwt-key.js");
const authenticate = require("../authentication/auth.js");

async function emailExists(email)
{
    const mongoClient = await clientPromise;
    const user = await mongoClient.db("note").collection("users").findOne({ email  });

    return user ? true: false;
}

//This request handler function allows users to create an account
userRouter.post("/user-create", async (req,res,next) => 
{
    const body = req.body;
    const mongoClient = await clientPromise;

    try
    {
        //Adding the user
        let user = {};

        if(body.name.length === 0)
            return res.status(400).send({ error: "Name should be 1 or more characters long"  });

        user.name = body.name;

        if(body.age < 0)
            return res.status(400).send({ error: "Age must be non-negative"  });

        user.age = body.age;

        if(body.password.length < 8)
            return res.status(400).send({ error: "Password must be at least 8 characters in length"  });

        user.password = await bcryptjs.hash(body.password, 8);
        user.tokens = [];

        if(!validator.isEmail(body.email))
            return res.status(400).send({ error: "Invalid email was provided"  });

        else if(await emailExists(body.email))
            return res.status(400).send({ error: "Account with this email already exists" });

        
        user.email = body.email;

        const userResponse = await mongoClient.db("note").collection("users").insertOne(user);

        const _id = userResponse.insertedId;
        const token = await jsonwebtoken.sign({ _id: _id.toString() }, jwtKey, { expiresIn: "14 days"  });

        await mongoClient.db("note").collection("users").updateOne({ _id }, { $push: { tokens: token  }  });

        //Sending a response which shows that a user account was successfully created
        res.status(201).send({ _id, token, name: user.name  });
        
    }
    catch(error)
    {
        res.status(500).send();
    }

}, (error,req,res,next) => 
{
    res.status(500).send();
});

// This request handler function allows users to login to their account
userRouter.post("/user-login", async (req,res,next) => 
{
    const {email, password} = req.body;
    const mongoClient = await clientPromise;

    try
    {
        const user  = await mongoClient.db("note").collection("users").findOne({ email });
        
        if(!user)
            return res.status(404).send({ error: "No user found with the given email"  });

        else if(user.tokens.length >= 4)
            return res.status(400).send({ error: "Can only have upto 4 devices logged in at a time"  });

        else if(! (await bcryptjs.compare(password, user.password)))
            return res.status(400).send({ error: "Invalid password"  });
        
        const token = await jsonwebtoken.sign({ _id: user._id.toString() }, jwtKey, { expiresIn: "14 days"  });

        user.tokens.push(token);

        await mongoClient.db("note").collection("users").replaceOne({ _id: user._id  }, user);

        res.status(200).send({ token, name: user.name  });

    }
    catch(error)
    {
        console.log(error);
        res.status(500).send();
    }

}, (error,req,res,next) => 
{
    res.status(500).send();
});

// This request handler function allows users to logout from their account
userRouter.post("/user-logout", authenticate, async (req,res,next) => 
{
    const mongoClient = await clientPromise;

    try
    {
        const user = req.user;
        const token = req.token;

        user.tokens = user.tokens.filter( element => element !== token);

        await mongoClient.db("note").collection("users").replaceOne({ _id: user._id  }, user);

        res.status(200).send({ message: "Successfully logged out"});
    }
    catch(error)
    {
        res.status(500).send();
    }


}, async (error,req,res,next) => 
{
    res.status(500).send();
});

// This request handler function allows a user to delete their account
userRouter.delete("/user-delete", authenticate, async (req,res,next) => 
{
    const mongoClient = await clientPromise;
    const user = req.user;

    try
    {
        await mongoClient.db("note").collection("users").deleteOne({ _id: user._id  });
        res.status(200).send({ message: `User account was deleted`  });
    }
    catch(error)
    {
        res.status(500).send();
    }

}, async (error,req,res,next) => 
{
    res.status(500).send();
});

module.exports = userRouter;
