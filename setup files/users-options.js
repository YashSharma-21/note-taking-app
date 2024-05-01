const options =     
{

    validator: 
    {
        $jsonSchema:
        {
            bsonType: "object",
            
            required: ["_id", "name", "age", "password", "tokens", "email"],

            properties: 
            {
                _id: 
                {
                    bsonType: "objectId",
                    description: "Must be an objectId and is required"
                },

                name: 
                {
                    bsonType: "string",
                    description: "Must be a string and is required"
                },

                age:
                {
                    bsonType: "number",
                    description: "Must be a number and is required"
                },

                password:
                {
                    bsonType: "string",
                    description: "Must be a string and is required"
                },

                tokens:
                {
                    bsonType: "array",
                    description: "Must be an array and is required",

                    items: 
                    {
                        bsonType: "string"
                    }

                },

                email:
                {
                    bsonType: "string",
                    description: "Must be a string and is required"
                }
            }

        }
    }
    


};

module.exports = options;