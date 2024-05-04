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
  <li>Run the "main.js" file to launch the application server.</li>
  <li>Send appropriate request messages to perform the desired operations such as creating user accounts, updating user details, creating notes etc.</li>
</ol>

<h2>API Specification</h2>
<ul>
  <li><b>Creating a User Account:</b> Send a POST request to <b>/user-create</b> which contains a JSON object in its body. This JSON object should have the following structure<br><br>
  <pre>
    {
      "name": "John Doe",
      "age": 43,
      "email": "john.doe@gmail.com",
      "password": "some.strong.password"
    }
  </pre>

  <h3>Some Possible Scenarios</h3>
  <ol>
    <li>If the "name" property holds an empty string value (that is, "") then the server will respond with a 400 status code and a JSON object in the body whose contents will be as follows:<br><br>
      <pre>
    { 
      "error": "Name should be 1 or more characters long"  
    }
      </pre>
    </li>
    <li>If the "age" property holds a number value that is negative then the server will respond with a 400 status code and a JSON object in the body whose contents will be as follows:<br><br>
      <pre>
    {
      "error": "Age must be non-negative"
    }
      </pre>
    </li>

    
  </ol>
    
  </li>
</ul>
