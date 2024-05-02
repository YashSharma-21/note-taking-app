const express = require("express");
const {Router} = express;
const noteRouter = new Router();
const clientPromise = require("../db-connectivity/mongo-client.js");
const authenticate = require("../authentication/auth.js");
const mongodb = require("mongodb");

// This request hanlder function allows a user to add a note
noteRouter.post("/note-create", authenticate, async (req,res,next) => 
{
    
    const mongoClient = await clientPromise;
    const note = {};
    const requestBody = req.body;
    note.creator = req.user._id;
    note.heading = requestBody.note.heading;
    note.body = requestBody.note.body;

    try
    {
        if(note.heading.length === 0)
            return res.status(400).send({ error: "Note heading should contain at least 1 character" });

        else if(note.body.length === 0)
            return res.status(400).send({ error: "Note body should contain at least 1 character"  });

        const noteResponse = await mongoClient.db("note").collection("notes").insertOne(note);
        note._id = noteResponse.insertedId;

        res.status(201).send(note);
    }
    catch(error)
    {
        res.status(500).send();
    }

});

noteRouter.get("/note", authenticate, async (req,res,next) => 
{
    const filter = { creator: req.user._id };
    const options = {};

    // These two query parameters can be used to implement pagination while making a request
    if(req.query.skip)
        options.skip = Number(req.query.skip);

    if(req.query.limit)
        options.limit = Number(req.query.limit);

    if(req.query.keywords)
        filter.$text = { $search: req.query.keywords };

    try
    {
        const mongoClient = await clientPromise;
        const notes = await mongoClient.db("note").collection("notes").find(filter,options).toArray();
        res.send(notes);

    }
    catch(error)
    {
        res.status(500).send();
    }
});

module.exports = noteRouter;
