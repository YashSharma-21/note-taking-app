const options = 
{
    validator:
    {
        $jsonSchema:
        {
            bsonType: "object",
            required: ["_id", "heading", "body", "creator"],
            properties:
            {
                _id:
                {
                    bsonType: "objectId",
                    description: "Must be an objectId and is required" 

                },

                heading:
                {
                    bsonType: "string",
                    description: "Must be a string and is required"
                },

                body:
                {
                    bsonType: "string",
                    description: "Must be a string and is required"
                },

                creator:
                {
                    bsonType: "objectId",
                    description: "Must be an objectId and is required"
                }
            }
        }
    }

};

module.exports = options;