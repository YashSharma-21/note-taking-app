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

// This request handler function allows a user to read their notes
noteRouter.get("/notes", authenticate, async (req,res,next) => 
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

// This request handler function allows users to delete a note that they created
noteRouter.delete("/note/:id", authenticate, async (req,res,next) => 
{
    try
    {
        const mongoClient = await clientPromise;
        const noteId = new mongodb.ObjectId(req.params.id);
        const deleteResponse = await mongoClient.db("note").collection("notes").deleteOne({ _id: noteId, creator: req.user._id  });

        if(deleteResponse.deletedCount === 0)
            return res.status(404).send({ error: "Note not found" });

        res.send({ message: "Note was deleted" });
    }
    catch(error)
    {
        res.status(500).send();
    }
});

// This request handler function allows a user to update their note
noteRouter.patch("/note/:id", authenticate, async (req,res,next) => 
{
    try
    {
        const mongoClient = await clientPromise;
        const noteId = new mongodb.ObjectId(req.params.id);
        const note = await mongoClient.db("note").collection("notes").findOne({ _id: noteId, creator: req.user._id  });

        if(!note)
            return res.status(404).send({ error: "Note not found" });

        const updates = req.body.updates;
        let updateFields = Object.keys(updates);
        const allowedFields = ["heading", "body"];

        updateFields = updateFields.filter( element => allowedFields.includes(element) );

        if(updates.heading && updates.heading.length === 0)
            return res.status(400).send({ error: "Note heading must be at least 1 character in length" });

        else if(updates.body && updates.body.length === 0)
            return res.status(400).send({ error: "Note body must be at least 1 character in length"  });

        for(let field of updateFields)
            note[field] = updates[field];

        await mongoClient.db("note").collection("notes").replaceOne({ _id: note._id  }, note);

        res.send(note);
        
    }
    catch(error)
    {
        res.status(500).send();
    }
});

module.exports = noteRouter;
