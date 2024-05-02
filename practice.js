const express = require("express");
const app = express();

app.use(express.json(), (error,req,res,next) => res.status(400).send("JSON body expected"));

app.get("/", (req,res,next) => 
{
    console.log(req.body);
    res.send(req.body);
});

app.listen(9000);