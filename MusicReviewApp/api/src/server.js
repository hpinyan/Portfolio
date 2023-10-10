const express = require('express');
const app = express();
const PORT = process.env.PORT;

//app.use(express.static('static'));
//app.use(express.json());
app.use(express.urlencoded({extended: true}));
const routes = require('./routes');

app.use(routes);

// app.use("/login", require("./routes/login.js"));


// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));