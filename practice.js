const express = require("express");
const app = express();

app.get("/", async (req,res,next) => 
{
    throw 1;

}, (error,req,res,next) => 
{
    console.log(`Error value = ${error}`);
    res.status(500).send(`Error value = ${error}`);
});

app.listen(9000);

/*If a request handling function is an async function then there is no
use in adding a error handling function after this async function 
(a function with 4 parameter variables) because even if an exception 
value is thrown from our async function, its calling expression would 
still only be substituted by a regular promise object value (which is not 
an error value), its just a fact that this promise object value represents
a promise object which is not is a rejected state, but because this
promise object value is not an exception value, the try block of that
internal function that calls our request handling functions does not
transfer our flow of control into its catch block because the control
is only transferred into a catch block when an exception value is thrown
from inside a try block and this does not happen in this situaiton */