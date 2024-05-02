const express = require("express");
const app = express();
const port = 9000;

const userRouter = require("./routers/users-router.js");
const noteRouter = require("./routers/notes-routers.js");

app.use(express.json());

app.use(userRouter);
app.use(noteRouter);

app.listen(port, () => console.log(`Note Server is running on port ${port}`));