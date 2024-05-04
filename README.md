# Note Taking App (Back-end)
<p>
  This program allows users to perform CRUD operations with respect to user accounts and notes. A user can also log-in multiple times (up to 4 times) on separate devices to simultaneously use the services provided by this program.
</p>
<p>
  This project uses JWTs (JSON Web Tokens) to authenticate users, whenever a new token is created, it is set to expire in 14 days. Also, user passwords are stored in form of hashes to offer more security to users.
</p>
<h2>Instructions to run this program</h2>
<ol>
  <li>First run the "setup.js" file to initialise the "note" database.</li>
  <li>Make sure that a mongoDB server process is running on your local machine.</li>
  <li>Run the "src/main.js" file to launch the application server.</li>
  <li>Send appropriate request messages to perform the desired operations such as creating user accounts, updating user details, creating notes etc.</li>
</ol>
Some requests require the user to be authenticated, user authentication is performed in this program by the means of "Bearer Tokens", simply add an "Authorization" header which holds a value of the format "Bearer &lt;token&gt;" (without the double quotes).

<h2>API Specification</h2>
<h3>User Related Operations:</h3>
<ul>
  <li><b>Creating a User Account:</b> Send a POST request to <b>/user-create</b> which contains a JSON object in its body. This JSON object should have the following structure:<br><br>
  <pre>
    {
      "name": "John Doe",
      "age": 43,
      "email": "john.doe@gmail.com",
      "password": "some.strong.password"
    }
  </pre>

  <h3>Some Possible Scenarios (while creating an account)</h3>
  <ol>
    <li>If the "name" property holds an empty string value (that is, "") then the server will respond with a 400 status code and a JSON object in the body whose contents will be as follows:<br><br>
      <pre>
    { 
      "error": "Name should be 1 or more characters long"  
    }
      </pre>
    </li>
    <br>
    <li>If the "age" property holds a number value that is negative then the server will respond with a 400 status code and a JSON object in the body whose contents will be as follows:<br><br>
      <pre>
    {
      "error": "Age must be non-negative"
    }
      </pre>
    </li>
    <br>
    <li>If the "password" property holds a string that is shorter than 8 characters in length then the server will respond with a 400 status code and a JSON object in the body whose contents will be as follows:<br><br>
    <pre>
    {
      "error": "Password must be at least 8 characters in length"
    }
    </pre>
    </li>
    <br>
    <li>If the "email" property holds a value that does not represent a valid email then the server will respond with a 400 status code and a JSON object in the body whose contents will be as follows:<br><br>
    <pre>
    {
      "error": "Invalid email was provided"
    }  
    </pre>
    </li>
    <li>If the "email" property holds a string value that represents an email that is already in use by some user account then the server will respond with a 400 status code and a JSON object whose contents will be as follows:<br><br>
    <pre>
    {
      "error": "Account with this email already exists"
    }  
    </pre>
    </li>
  </ol>
  <p>If valid contents are provided then the server responds with a 201 status code and a JSON object which will have its contents as follows:<br><br>
  <pre>
    {
      "_id": "66363e30cbf5825566c7468c",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM2M2UzMGNiZjU4MjU1NjZjNzQ2OGMiLCJpYXQiOjE3MTQ4MzA4OTYsImV4cCI6MTcxNjA0MDQ5Nn0.2c9QQgHT0b6-iE3Vq9un-KFONMKTBIGdni0NheHw9mw",
      "name": "John Doe"
    }
  </pre></p>
    
  </li>
  <br>
  <br>
  <li><b>Logging in as a User:</b> Send a POST request to <b>/user-login</b> which contains a JSON object in its body. This JSON object should have the following structure:<br><br>
  <pre>
    {
      "email": "john.doe@gmail.com",
      "password": "some.strong.password"
    }
  </pre>

  <h3>Some Possible Scenarios (while logging in)</h3>
  <ol>
    <li>If the "email" property holds a string that represents an email which does not belong to any user then, the server responds with a 404 status code and a JSON object whose contents will be as follows:<br><br>
    <pre>
    {
      "error": "No user found with the given email"
    }
    </pre>
    </li>
    <br>
    <li>If the user tries to log-in even though he/she is already logged in 4 times then the server responds with a 400 status code and a JSON object whose contents will be as follows:<br><br>
    <pre>
    {
      "error": "Can only have upto 4 devices logged in at a time"  
    }
    </pre>
    </li>
    <br>
    <li>If the user provides an incorrect password in the "password" property then the server responds with a 400 status code and a JSON object whose contents will be as follows:<br><br>
    <pre>
    {
      "error": "Invalid password"
    }
    </pre>
    </li>
  </ol>
  <p>If a valid request is sent then the server responds with a 200 status code and a JSON object whose contents are of the following structure:<br><br>
  <pre>
   {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM2M2UzMGNiZjU4MjU1NjZjNzQ2OGMiLCJpYXQiOjE3MTQ4MzQ3MjIsImV4cCI6MTcxNjA0NDMyMn0.qmZX0mKS-YF-BHpE9yaQwfdOlkTprlUgJdYk82ygIc0",
      "name": "John Doe",
      "_id": "66363e30cbf5825566c7468c"
    } 
  </pre>
  Here, the "token" property contains a string value that represents the newly created token for the current log-in.
  </p>
  </li>
  <br><br>
  <li><b>Logging out as a User:</b> Send a POST request to <b>/user-logout</b>. This request does not need a body but it is an operation that requires user authentication.
  If a user is authenticated then the server responds with a 200 status code and a JSON object whose contents will be as follows:<br><br>
  <pre>
  { 
    "message": "Successfully logged out"
  }
  </pre>
  </ol>
  </li>
  <br>
  <br>
  <li><b>Deleting a User:</b> Send a DELETE request to <b>/user-delete</b>. If the user is authenticated then the token that was used for authentication will be deleted from the "note" database when this request is processed. As a result
  , the server will respond with a 200 status code and a JSON object whose structure will be as follows:<br><br>
  <pre>
  { 
    "message": "User account was deleted"  
  }
  </pre>
  </li>
  <br>
  <br>
  <li><b>Reading User Details: </b> Send a GET request to <b>/user</b>. If the user is authenticated and the request is processed successfully then the server responds with a 200 status code and a JSON object whose contents will be as follows:<br><br>
  <pre>
  {
    "_id": "66363e30cbf5825566c7468c",
    "name": "John Doe",
    "age": 43,
    "email": "john.doe@gmail.com"
  }
  </pre>
  Here, certain details such as password hash and log-in tokens of a user account have been explicitly hidden in the response.
  </li>
  <br>
  <br>
  <li><b>Updating a User's Details:</b> Send a PATCH request to <b>/user-update</b> which contains a JSON object in its body. This JSON object should have the following structure:<br><br>
  <pre>
  {
    "updates": 
      { 
        "name": "Dummy Name",
        "email": "john.doe@outlook.com", 
        "password": "newpassword", 
        "age": 44 
      }
  }
  </pre>
  <h3>Some Possible Scenarios (while updating a user)</h3>
  <ol>
  <li>If the "email" property holds a string value which does not represent a valid email then the server responds with a 400 status code and a JSON object which has the following contents:<br><br>
  <pre>
  { 
    "error": "Invalid email"  
  }
  </pre>
  </li>
  <br>
  <li>If the "password" property holds a string which has less than 8 characters then the server responds with a 400 status code and a JSON object which has the following contents:<br><br>
  <pre>
  { 
    "error": "Password should be at least 8 characters long" 
  }
  </pre>
  </li>
  <br>
  <li>If the "age" property holds a number value that is negative then the server responds with a 400 status code and a JSON object which has the following contents:<br><br>
  <pre>
  { 
    "error": "Age must be non-negative"  
  }
  </pre>
  </li>
  <br>
  <li>If the "name" property holds an empty string (that is, "") then the server responds with a 400 status code and a JSON object which will have the following contents:<br><br>
  <pre>
  { 
    "error": "Name must be at least 1 character long"  
  }
  </pre>
  </li>
  <br>
  <li>If the "email" property holds a string that represents an email that is being already used by some other user then the server responds with a 400 status code and a JSON object which has the following contents:<br><br>
  <pre>
  { 
    "error": "An account with this email already exists"  
  }
  </pre>
  </li>
  If valid contents are provided then the server responds with a 200 status code and a JSON object which represents the updated state of the user's account, it will have the following structure:<br><br>
  <pre>
  {
    "_id": "66363e30cbf5825566c7468c",
    "name": "Dummy Name",
    "age": 44,
    "email": "john.doe@outlook.com"
  }
  </pre>
  Note that, it is not required to provide new values for <b>all</b> the fields of a user, any of the valid fields of a user can be provided in the request message's body to perform an update operation.
  
  </ol>
  </li>
  
</ul>

<h3>Note Related Operations:</h3>
<ul>
<li><b>Creating a Note:</b> Send a POST request to <b>/note-create</b> which contains a JSON object in its body. This JSON object should be of following structure:<br><br>
<pre>
{
    "note": 
      {  
        "heading": "Listen to some music", 
        "body": "Linkin Park songs would be great"  
      }
}
</pre>
<h3>Some Possible Scenarios (while creating a note)</h3>
<ol>
<li>If the "heading" property holds an empty string value (that is, "") then the server responds with a 400 status code and a JSON object which has the following contents:<br><br>
<pre>
{ 
  "error": "Note heading should contain at least 1 character" 
}  
</pre>
</li>
<br>
<li>If the "body" property holds an empty string value (that is, "") then the server responds with a 400 status code and a JSON object which has the following contents:<br><br>
<pre>
{ 
  "error": "Note body should contain at least 1 character"  
}
</pre>
</li>
<br>
If valid contents are provided then the server responds with a 201 status code and a JSON object which has the following contents:<br><br>
<pre>
{
    "creator": "66363e30cbf5825566c7468c",
    "heading": "Listen to some music",
    "body": "Linkin Park songs would be great",
    "_id": "6636686fcbf5825566c7468d"
}
</pre>
  
</ol>
</li>
<br>
<br>
<li><b>Reading a Note:</b> Send a GET request to <b>/notes</b>. This request message can make use of some query parameters. Those query parameters are as follows:<br><br>
  <ol>
    <li><b>skip:</b> This can hold a numeric value which should be a whole number, it represents the number of notes that should be skipped from the start of the result.</li>
    <li><b>limit:</b> This can also hold a numeric value which should be a whole number, it represents the number of notes that should be returned in the response message.</li>
    <li><b>keywords:</b> This can hold a space separated list of keywords. These keywords represent the words that should be present inside a note's heading or body.</li>
  </ol>
If a valid request is sent then the server will respond with a 200 status code with a JSON array which will store note objects which will have the following structure:<br><br>
<pre>
[
    {
        "_id": "6636686fcbf5825566c7468d",
        "creator": "66363e30cbf5825566c7468c",
        "heading": "Listen to some music",
        "body": "Linkin Park songs would be great"
    },
    {
        "_id": "66366acacbf5825566c7468e",
        "creator": "66363e30cbf5825566c7468c",
        "heading": "Draw a painting",
        "body": "Try drawing a flower, such as a rose."
    }
]
</pre>
</li>
<br><br>
<li><b>Deleting a Note:</b> Send a DELETE request to <b>/note/id</b>. Here, the "id" part should be the id of some note that the user has created. If the request provides an id that does not represent the id of any note that the authenticated user has created then the server will response with a 404 status code and a JSON object which will have the following contents:<br><br>
<pre>
{ 
  "error": "Note not found" 
}
</pre>
If a valid id is provided then the server will respond with a 200 status code and a JSON object which will have the following contents:<br><br>
<pre>
{ 
  "message": "Note was deleted" 
}
</pre>
</li>
<br><br>
<li><b>Updating a Note: </b> Send a PATCH request to <b>/note/id</b>. Here, the "id" part should represent the id of some note that the user has created. The request should also contain a JSON object in its body part which should have the following structure:<br><br>
<pre>
{
    "updates": { "heading": "Have some tea", "body": "Have the tea with some biscuits."}
}
</pre>
<h3>Some Possible Scenarios (while updating a note)</h3>
<ol>
  <li>If a note with the given id is not found in the list of notes created by a user then the server responds with a 404 status code and a JSON object which has the following contents:<br><br>
  <pre>
  { 
    "error": "Note not found" 
  }
  </pre>
  </li>
  <li>If the "heading" property holds an empty string value (that is, "") then the server will respond with a 400 status code and a JSON object which will have the following contents:<br><br>
  <pre>
  { 
    "error": "Note heading must be at least 1 character in length" 
  }
  </pre>
  </li>
  <li>If the "body" property holds an empty string value (that is, "") then the server will respond with a 400 status code and a JSON object which will have the following contents:<br><br>
  <pre>
  { 
    "error": "Note body must be at least 1 character in length" 
  }
  </pre></li>
</ol>
Just like the update request for a user account, this request does not need to provide values for <b>all</b> the fields of a note, a user is free to update only some required fields. If valid contents are provided then the server responds with a 200 status code and a JSON object which will have the following structure:<br><br>
<pre>
{
  "_id": "66366acacbf5825566c7468e",
  "creator": "66363e30cbf5825566c7468c",
  "heading": "Have some chips for snacks",
  "body": "Also have a cold coffee"
}
</pre>
</li>
</ul>
