const {MongoClient} = require("mongodb");

async function setup(ip = "localhost",port = 27017)
{
    const mongoClient = await MongoClient.connect(`mongodb://${ip}:${port}`);

    const db = mongoClient.db("note");

    let options = require("./setup files/users-options.js");

    await db.createCollection("users", options);

    

    options = require("./setup files/notes-options.js");

    await db.createCollection("notes", options);

    return mongoClient;
}


setup().then(client => 
{
    console.log("The database has been initialised");
    
    client.close();
    
},error => console.log(error));